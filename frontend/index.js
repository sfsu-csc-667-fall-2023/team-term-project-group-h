var displayForm = true;
var form = document.getElementById("Sign-Up");
form.addEventListener("click", SignUp);
var form2 = document.getElementById("Sign-Up-Form");
function SignUp(event) {
  event.preventDefault();
  displayForm = !displayForm;
  if (displayForm === false) {
    form2.innerHTML = `
    <form method="POST" action="/login/sign_up">
        <button id="close-button" class="btn-close" aria-label="Close" ></button>
        <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <input type="text" class="form-control" id="username" name="username">
        </div>
        <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control" name ="password" id="password">
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
    </form>
    `;
    document.getElementById("close-button").addEventListener("click", SignUp);
  } else {
    form2.innerHTML = "";
  }
}