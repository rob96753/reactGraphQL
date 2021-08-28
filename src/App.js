import github from "./db.js";
import { useEffect, useState, useCallback } from "react";
import query from "./Query";
import RepoInfo from "./RepoInfo";
import SearchBox from "./SearchBox";
import NavButtons from "./NavButtons.js";


function App() {

  let [userName, setUserName] = useState("");
  let [repoList, setRepoList] = useState(null);
  let [pageCount, setPageCount] = useState(10);
  let [queryString, setQueryString] = useState("is:public");  
  let [totalCount, setTotalCount] = useState(null);

  let [startCursor, setStartCursor] = useState(null);
  let [endCursor, setEndCursor] = useState(null);
  let [hasPreviousPage, setHasPreviousPage] = useState(false);
  let [hasNextPage, setHasNextPage] = useState(false);
  let [paginationString, setPaginationString] = useState("");
  let [paginationKeyword, setPaginationKeyword] = useState("first");

  const fetchData = useCallback( () => {
    const queryText = JSON.stringify(query( pageCount, 
                                            queryString, 
                                            paginationKeyword, 
                                            paginationString));

    fetch(github.baseURL, { 
      method: "POST",
      headers: github.headers,
      body: queryText
    })
    .then( response => response.json())
    .then( data => {
      const viewer = data.data.viewer;
      const repos = data.data.search.edges;
      const total = data.data.search.repositoryCount;

      const start = data.data.search.pageInfo?.startCursor;
      const end = data.data.search.pageInfo?.endCursor;
      const next = data.data.search.pageInfo?.hasNextPage;
      const prev = data.data.search.pageInfo?.hasPreviousPage;

      setStartCursor(start);
      setEndCursor(end);
      setHasNextPage(next);
      setHasPreviousPage(prev);

      setUserName(viewer.name);
      setRepoList(repos);
      setTotalCount(total);
    })
    .catch( err => {
      console.log(err);
    });
  }, [pageCount, queryString, paginationString, paginationKeyword]); // if any of these values change, then the fetch command will re-run.

  useEffect( () => {  
    fetchData() 
  }, [fetchData]);



  return (
    
      <div className="App container mt-5">
        <h1 id="repos-header" className="text-primary">
          <i id="repos-icon" className="bi bi-diagram-2-fill"></i> Repos
        </h1>
        <p id="welcome-message">Welcome {userName}</p>
        <SearchBox 
          totalCount={totalCount}
          pageCount={pageCount}
          queryString={queryString}
          onTotalChange={(myNumber) => {setPageCount(myNumber)}}
          onQueryChange={(myString) => {setQueryString(myString)}}
        />
        <NavButtons 
          start={startCursor} 
          end={endCursor} 
          next={hasNextPage} 
          previous={hasPreviousPage} 
          onPage= {((myKeyword, myString) => {
            setPaginationKeyword(myKeyword);            
            setPaginationString(myString);
          })
          }
          />
        { repoList && (
          <ul className="list_group list-group-flush">
            {repoList.map((repo) => (
              <RepoInfo key = {repo.node.id} repo = {repo.node}/>
            ))}
          </ul>
        )
        }
        <NavButtons 
          start={startCursor} 
          end={endCursor} 
          next={hasNextPage} 
          previous={hasPreviousPage} 
          onPage= {((myKeyword, myString) => {
            setPaginationKeyword(myKeyword);            
            setPaginationString(myString);
          })
          }
          />
        
      </div>
  );
}

export default App;
