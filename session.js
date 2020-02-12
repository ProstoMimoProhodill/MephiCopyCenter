let host = "192.168.1.51";

let delay = 1200000;
// let delay = 5000;

let timerId = setInterval(function request() {
  // let question = confirm("Бездействие! (OK - продолжить, Cancel - выйти)");
  // if(!question){
  //   window.location = "/logout.php";
  //   console.log("Выход");
  // }else{
  //   console.log("Остаемся");
  // }
  window.location = "/logout.php";
  console.log("Выход");
}, delay);

$.ajax('session.php',{
    success: function(data) {
      window.addEventListener('load',function(){
        if(window.location.host == host){

          //set cookie for 5 minutes
          if(data != ""){
            console.log("user=" + data + "; max-age=300");
            document.cookie = "user=" + data + "; max-age=300";
          }

          if(window.location.pathname == "/login.html"){
            function getCookie(name) {
              let matches = document.cookie.match(new RegExp(
                "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
              ));
              return matches ? decodeURIComponent(matches[1]) : undefined;
            }
            document.getElementById('username').value = getCookie('user');
          }

          //routing
          if(data=="admin"){
            let parent = document.getElementById("btn_create").parentNode;
            parent.innerHTML += `<button class="btn btn-primary center-block align-middle" id="btn_edit" style="margin-top: 15px">Редактировать заказ</button>`;
            parent.innerHTML += `<button class="btn btn-primary center-block align-middle" id="btn_add_balance" style="margin-top: 15px">Пополнить баланс заказов</button>`;
            // parent.innerHTML += `<div class="checkbox"><label><input type="checkbox" value="" id="processed">Блокировка</label></div>`;
            document.getElementById("btn_create").addEventListener('click', function(){
              admin_create(data);
            });
            document.getElementById("btn_edit").addEventListener('click', function(){
              admin_edit(data);
            });
            document.getElementById("btn_add_balance").addEventListener('click', function(){
              admin_add_balance(data);
            });
          }else if(data){
            document.getElementById("btn_create").addEventListener('click', function(){
              user_create(data);
            });
          }else{
            if(window.location.pathname != "/login.html"){
              document.getElementById("btn_create").addEventListener('click', function(){
                window.location = "/login.html";
              });
            }
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
