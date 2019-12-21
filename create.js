function user_create(d){
  let btn_create = document.getElementById("btn_create");
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

  let edition = data['edition'];

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
      <input type="text" id="edition" name="edition" class="form-control" value="1" placeholder="edition" required autofocus>
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

  document.getElementsByTagName("html")[0].addEventListener('mouseover', function(){
    // todo : sale
    let format = parseInt(data['format'][parseInt(document.getElementById('format').selectedIndex)]['price']);
    let quality = parseInt(data['quality'][parseInt(document.getElementById('quality').selectedIndex)]['price']);
    let decor = parseInt(data['decor'][parseInt(document.getElementById('decor').selectedIndex)]['price']);
    let edition = parseInt(document.getElementById('edition').value);
    price = (format + quality + decor)*edition;
    document.getElementById("price").innerHTML = "Итого: " + price;
  });

  document.getElementById('send').addEventListener('click', function(){
    $.ajax({
        url: 'create.php',
        type: "POST",
        data: {
          'type': 'create_post',
          'id_format': parseInt(document.getElementById('format').selectedIndex + 1),
          'id_quality': parseInt(document.getElementById('quality').selectedIndex + 1),
          'id_decor': parseInt(document.getElementById('decor').selectedIndex + 1),
          'url': document.getElementById('url').value,
          'price': price,
          'edition': parseInt(document.getElementById('edition').value),
          'processed': document.getElementById('processed').checked ? 1 : 0,
          'consistent_total': document.getElementById('consistent_total').checked ? 1 : 0
        },
        success: function(r) {
          console.log(r);
          alert("Успешно!");
          window.location = "http://mephicopycenter.ru/";
        },
        error: function() {
          console.log("ERROR: AJAX");
        },
        async: false
    });
  });

}


function admin_create(d) {
  user_create(d);
}

function admin_edit(d) {
  let btn_create = document.getElementById("btn_create");
  let btn_edit = document.getElementById("btn_edit");
  let parent = btn_create.parentNode;

  let data = [];
  $.ajax({
      url: 'create.php',
      type: "POST",
      data: {
        'type' : 'edit_get_orders',
      },
      success: function(d) {
        data = d;
      },
      error: function() {
        console.log("ERROR: AJAX");
      },
      async: false
  });

  data = JSON.parse(data);
  let orders = "";
  for (let i=0; i<data.length;i++){
    orders += `<option> ` + data[i]['id_order'] + " - " + data[i]['id_user'] + " - " + data[i]['created_at'] + ` </option>`;
  }

  parent.innerHTML = `<form class="form-signin">
    <label for="format">Выберите заказ</label>
    <div class="form-label-group">
      <select class="form-control" id="orders">
      ` + orders + `
      </select>
    </div>
    <br>
    <button class="btn btn-lg btn-primary btn-block text-uppercase" id="send" type="submit">Выбрать</button>
  </form>`;

  document.getElementById('send').addEventListener('click', function(){
    $.ajax({
        url: 'create.php',
        type: "POST",
        data: {
          'type': 'edit_get_orders_data',
          'id_order': parseInt(document.getElementById('orders').selectedIndex + 1)
        },
        success: function(r) {
          let id_consistent_total_data = parseInt(r);
          parent.innerHTML = "";
          parent.innerHTML = `<form class="form-signin">
            <div class="checkbox">
              <label><input type="checkbox" value="" id="printed">Отпечатано</label>
            </div>
            <div class="checkbox">
              <label><input type="checkbox" value="" id="decorated">Оформлено</label>
            </div>
            <button class="btn btn-lg btn-primary btn-block text-uppercase" id="send_post" type="submit">Отправить</button>
          </form>`;

          document.getElementById('send_post').addEventListener('click', function(){
            $.ajax({
                url: 'create.php',
                type: "POST",
                data: {
                  'type': 'edit_post',
                  'id_consistent_total_data': id_consistent_total_data,
                  'printed': document.getElementById('printed').checked ? 1 : 0,
                  'decorated': document.getElementById('decorated').checked ? 1 : 0
                },
                success: function(r) {
                  console.log(r);
                  alert("Успешно!");
                  window.location = "http://mephicopycenter.ru/";
                },
                error: function() {
                  console.log("ERROR: AJAX");
                },
                async: false
            });
          });

        },
        error: function() {
          console.log("ERROR: AJAX");
        },
        async: false
    });
  });
}
