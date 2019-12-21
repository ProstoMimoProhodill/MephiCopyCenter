let delay = 1200000;
let timerId = setTimeout(function request() {
  if(!confirm("Бездействие")){
    window.location = "/logout.php";
  }
}, delay);

$.ajax('session.php',{
    success: function(data) {

      window.addEventListener('load',function(){
        if(window.location == "http://mephicopycenter.ru/"){

          if(data=="admin"){
            var parent = document.getElementById("btn_create").parentNode;
            parent.innerHTML += `<button class="btn btn-primary center-block align-middle" id="btn_edit" style="margin-top: 15px">Редактировать заказ</button>`;
            parent.innerHTML += `<button class="btn btn-primary center-block align-middle" id="btn_see" style="margin-top: 15px">Просмотр заказов</button>`;
          }

          document.getElementById("btn_create").addEventListener('click', function(){
            //func in create.js
            if(data){
              if(data=="admin"){
                admin_create(data);
              }else{
                user_create(data);
              }
            }else{
              console.log("To login page");
              window.location = "http://mephicopycenter.ru/login.html";
            }
          });
        }
      });

      console.log(data);
      if(data){
        var btn_sign_up = document.getElementById("btn_sign_up");
        var btn_log_in = document.getElementById("btn_log_in");
        var parent = btn_log_in.parentNode;
        parent.innerHTML = `<li id="btn_log_out"><a href="logout.php"><span class="glyphicon glyphicon-log-in"></span> Logout</a></li>`;
      }

    },
    error: function() {
      console.log("ERROR: AJAX");
    },
    async: false
  }
);
