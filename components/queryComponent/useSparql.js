// import React, { useState, useEffect } from 'react';

// function useQueryResults(fetch, query, sources) {

//   for (let source of sources) {
//     fetch(source).then(response =>
//       rdf.parse(response.)
//     )
//   }
//   // fetchFunction()
//   // const [isOnline, setIsOnline] = useState(null);
//   // useEffect(() => {
//   //   function handleStatusChange(status) {
//   //     setIsOnline(status.isOnline);
//   //   }
//   //   ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
//   //   return () => {
//   //     ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
//   //   };
//   // });

//   // if (isOnline === null) {
//   //   return 'Loading...';
//   // }
//   return isOnline ? 'Online' : 'Offline';
// }