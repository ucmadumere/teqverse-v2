

// // Function to handle form submission
// function handleLogin(event) {
//     event.preventDefault(); // Prevent the default form submission behavior
  
//     // Get the form data
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;
  
//     // Send the login request to the server
//     fetch('/login', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ email, password }),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         // Check if the login was successful
//         if (data.token) {
//           // Store the token in localStorage
//           localStorage.setItem('token', data.token);
  
//           // Redirect to the business page
//           window.location.href = '/business';
//         } else {
//           // Handle unsuccessful login (e.g., display an error message)
//           console.error('Login failed:', data.message);
//         }
//       })
//       .catch((error) => {
//         console.error('Error during login:', error);
//       });
//   }
  
//   // Attach the handleLogin function to the form submission event
//   document.getElementById('loginForm').addEventListener('submit', handleLogin);
  


  // Function to handle form submission
function handleLogin(event) {
    event.preventDefault(); // Prevent the default form submission behavior
  
    // Get the form data
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    // Send the login request to the server
    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Check if the login was successful
        if (data.token) {
          // Store the token in localStorage
          localStorage.setItem('token', data.token);
  
          // Redirect to the business page
          window.location.href = '/business';
        } else {
          // Handle unsuccessful login (e.g., display an error message)
          console.error('Login failed:', data.message);
        }
      })
      .catch((error) => {
        console.error('Error during login:', error);
      });
  }
  
  // Attach the handleLogin function to the form submission event
  document.getElementById('loginForm').addEventListener('submit', handleLogin);
  