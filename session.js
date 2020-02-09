let host = "192.168.1.51";

let delay = 1200000;
let timerId = setInterval(function request() {
  let question = confirm("Бездействие! (OK - продолжить, Cancel - выйти)");
  if(!question){
    window.location = "/logout.php";
    console.log("Выход");
  }else{
    console.log("Остаемся");
  }
}, delay);

$.ajax('session.php',{
    success: function(data) {
      window.addEventListener('load',function(){
        if(window.location.host == host){
          if(data=="admin"){
            let parent = document.getElementById("btn_create").parentNode;
            parent.innerHTML += `<button class="btn btn-primary center-block align-middle" id="btn_edit" style="margin-top: 15px">Редактировать заказ</button>`;
            document.getElementById("btn_create").addEventListener('click', function(){
              admin_create(data);
            });
            document.getElementById("btn_edit").addEventListener('click', function(){
              admin_edit(data);
            });
          }else if(data){
            document.getElementById("btn_create").addEventListener('click', function(){
              user_create(data);
            });
          }else{
            document.getElementById("btn_create").addEventListener('click', function(){
              window.location = "/login.html";
            });
          }
        }
      });

      console.log(data);
      if(data){
        let btn_sign_up = document.getElementById("btn_sign_up");
        let btn_log_in = document.getElementById("btn_log_in");
        let parent = btn_log_in.parentNode;
        parent.innerHTML = `<li id="btn_log_out"><a href="logout.php"><span class="glyphicon glyphicon-log-in"></span> Logout</a></li>`;
      }

    },
    error: function() {
      console.log("ERROR: AJAX");
    },
    async: false
  }
);
