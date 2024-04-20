export default async function ErrorHandler(func, args) {
  // well, we may need to change how handler responses to each error
  return await func(args).catch((error) => {
    console.error(error);

    if (error.response.status == 401) {
      dispatch({ type: "ERROR", error: "NOT AUTHENTICATED" });
    } else if (error.response.status == 403) {
      alert("Forbidden action!");
    } else if (error.response.status == 404) {
      alert("Resource not found!");
    } else if (error.response.status == 500) {
      dispatch({ type: "ERROR", error: "SERVER ERROR" }); // may need different reducer action
      // alert("Server error!"); // which one is better?
    }

    throw error;
  });
}
