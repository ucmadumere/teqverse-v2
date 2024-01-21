// Define a middleware function to check the role of the user
const checkRole = (role) => {
    return (req, res, next) => {
      // Get the user from the request
      const user = req.user;
      // If the user exists and has the required role, proceed to the next middleware
      if (user && user.role === role) {
        next();
      } else {
        // Otherwise, send a 403 forbidden response
        res.status(403).send('You are not authorized to access this resource');
      }
    };
  };