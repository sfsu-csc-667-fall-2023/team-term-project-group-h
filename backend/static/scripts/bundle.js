(()=>{var n=!0;document.getElementById("Sign-Up").addEventListener("click",(function t(s){s.preventDefault(),!1==(n=!n)?(e.innerHTML='\n    <form method="POST" action="/login/user">\n        <button id="close-button" class="btn-close" aria-label="Close" ></button>\n        <div class="mb-3">\n            <label for="username" class="form-label">Username</label>\n            <input type="text" class="form-control" id="username" name="username">\n        </div>\n        <div class="mb-3">\n            <label for="password" class="form-label">Password</label>\n            <input type="password" class="form-control" name ="password" id="password">\n        </div>\n        <button type="submit" class="btn btn-primary">Submit</button>\n    </form>\n    ',document.getElementById("close-button").addEventListener("click",t)):e.innerHTML=""}));var e=document.getElementById("Sign-Up-Form")})();