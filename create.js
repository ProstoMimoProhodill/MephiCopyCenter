function user_create(d){
  var btn_create = document.getElementById("btn_create");
  let parent = btn_create.parentNode;
  btn_create.remove();

  let price = 0;
  let data = [];
    $.ajax({
        url: 'create.php',
        type: "POST",
        data: {
          'type' : 'create_get',
        },
        success: function(r) {
          // console.log(r);
          data = r;
        },
        error: function() {
          console.log("ERROR: AJAX");
        },
        async: false
    });

  data = JSON.parse(data);
  let format = "";
  for (let i=0; i<data['format'].length;i++){
    format += `<option> ` + data['format'][i]['name'] + " - " + data['format'][i]['price'] + `руб </option>`;
  }

  let quality = "";
  for (let i=0; i<data['quality'].length;i++){
    quality += `<option> ` + data['quality'][i]['name'] + " - " + data['quality'][i]['price'] + `руб </option>`;
  }

  let decor = "";
  for (let i=0; i<data['decor'].length;i++){
    decor += `<option> ` + data['decor'][i]['name'] + " - " + data['decor'][i]['price'] + `руб </option>`;
  }

  parent.innerHTML = `<form class="form-signin">
    <label for="format">Формат</label>
    <div class="form-label-group">
      <select class="form-control" id="format">
      ` + format + `
      </select>
    </div>
    <br>
    <label for="quality">Качество</label>
    <div class="form-label-group">
      <select class="form-control" id="quality">
        ` + quality + `
      </select>
    </div>
    <br>
    <label for="decor">Оформление</label>
    <div class="form-label-group">
      <select class="form-control" id="decor">
        ` + decor + `
      </select>
    </div>
    <br>
    <div class="form-label-group">
      <input type="text" id="edition" name="edition" class="form-control" placeholder="edition" required autofocus>
      <label for="edition">Количество копий</label>
    </div>
    <br>
    <div class="form-label-group">
      <input type="text" id="url" name="url" class="form-control" placeholder="url" required autofocus>
      <label for="url">URL изображения</label>
    </div>
    <br>
    <div class="checkbox">
      <label><input type="checkbox" value="" id="processed">Постобработка</label>
    </div>
    <div class="checkbox">
      <label><input type="checkbox" value="" id="consistent_total">Согласование итогового варианта</label>
    </div>
    <label id="price">Итого: </label>
    <button class="btn btn-lg btn-primary btn-block text-uppercase" id="send" type="submit">Отправить</button>
  </form>`;

  price = data['format'][parseInt(document.getElementById('format').selectedIndex + 1)]['price'];
  console.log(price);

  document.getElementById('send').addEventListener('click', function(){
    $.ajax({
        url: 'create.php',
        type: "POST",
        data: {
          'id_format': parseInt(document.getElementById('format').selectedIndex + 1),
          'id_quality': parseInt(document.getElementById('quality').selectedIndex + 1),
          'id_decor': parseInt(document.getElementById('decor').selectedIndex + 1),
          'url': document.getElementById('url').value,
          'edition': parseInt(document.getElementById('edition').value),
          'processed': document.getElementById('processed').checked,
          'consistent_total': document.getElementById('consistent_total').checked
        },
        success: function(r) {
          // console.log(r);

        },
        error: function() {
          console.log("ERROR: AJAX");
        },
        async: false
    });
  });

}

function admin_create(d) {
  // console.log("admin");
  var btn_create = document.getElementById("btn_create");
  var btn_edit = document.getElementById("btn_edit");
  var btn_see = document.getElementById("btn_see");


  btn_create.addEventListener('click', function(){
    $.ajax({
        url: 'create.php',
        type: "POST",
        data: {
          'type' : 'create',
        },
        success: function(data) {
          console.log(data);
        },
        error: function() {
          console.log("ERROR: AJAX");
        },
        async: false
    });
  });
  btn_edit.addEventListener('click', function(){
    $.ajax({
        url: 'create.php',
        type: "POST",
        data: {
          'type' : 'edit',
        },
        success: function(data) {
          console.log(data);
        },
        error: function() {
          console.log("ERROR: AJAX");
        },
        async: false
    });
  });
  btn_see.addEventListener('click', function(){
    $.ajax({
        url: 'create.php',
        type: "POST",
        data: {
          'type' : 'see',
        },
        success: function(data) {
          console.log(data);
        },
        error: function() {
          console.log("ERROR: AJAX");
        },
        async: false
    });
  });
}
