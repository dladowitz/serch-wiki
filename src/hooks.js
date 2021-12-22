import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

export const useSearch = (query) => {
  
  const [state, setState] = useState({
    articles: [],
    status: 'IDLE',
    error: ''
  });

  const cancelToken = useRef(null);

  useEffect(() => {
    if(query.length < 3){
      return;
    }

    if(cancelToken.current){
      cancelToken.current.cancel();
      console.log("setting cancel request")
    }

    cancelToken.current = axios.CancelToken.source();

    // Make a request for a user with a given ID
    axios.get(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${query}&origin=*`, {
      cancelToken: cancelToken.current.token
    })
    .then(function (response) {
      // handle success
      const parsedResponse = [];

      for(let i = 0; i < response.data[1].length; i++){
        parsedResponse.push({
          id: response.data[3][i],
          label: response.data[1][i]
        })
      };

      setState({
        articles: parsedResponse,
        status: 'SUCCESS', 
        error: ''
      });
    })
    .catch(function (error) {
      // handle error
      if (axios.isCancel(error)) {
        console.log("catch canceled")
        return;
      }

      setState({
        articles: [],
        status: 'ERROR',
        error: error
      });
    })
  }, [query]);
    
  return state;
};