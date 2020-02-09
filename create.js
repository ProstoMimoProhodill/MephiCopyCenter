let LOCK = 1;

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
  let balance = data['balance'][0]['balance'];

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
      <label for="edition">Количество копий (Доступно - ` + balance + ` штук)</label>
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
    if(parseInt(document.getElementById('edition').value) <= balance && balance != 0){
      $.ajax({
          url: 'create.php',
          type: "POST",
          data: {
            'lock': LOCK,
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
            if(r == "error"){
              alert("Ошибка");
            }else{
              alert("Успешно!");
            }
            window.location = "/";
          },
          error: function() {
            console.log("ERROR: AJAX");
          },
          async: false
      });
    }else{
      alert("Не допустимое количество! Попробуйте заново")
      window.location = "/";
    }
  });
}


function admin_create(d) {
  user_create(d);
}

function admin_edit_order(d, id_order){
  //get template
  let btn_send = document.getElementById("send");
  let parent = btn_send.parentNode;
  btn_send.remove();

  let price = 0;
  let data = [];
  $.ajax({
      url: 'create.php',
      type: "POST",
      data: {
        'type' : 'create_get',
      },
      success: function(r) {
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

  //get data about order - id
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
      <input type="text" id="edition" name="edition" class="form-control" value="1" placeholder="edition" required autofocus disabled>
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
    <div class="checkbox">
      <label><input type="checkbox" value="" id="printed">Отпечатано</label>
    </div>
    <div class="checkbox">
      <label><input type="checkbox" value="" id="decored">Оформлено</label>
    </div>
    <label id="price">Итого: </label>
    <button class="btn btn-lg btn-primary btn-block text-uppercase" id="save" type="submit">Сохранить</button>
  </form>`;

  //set data from database
  let order = JSON.parse(d);
  document.getElementById('format').selectedIndex = parseInt(order['data'][0]['id_format'] - 1);
  document.getElementById('quality').selectedIndex = parseInt(order['data'][0]['id_quality'] - 1);
  document.getElementById('decor').selectedIndex = parseInt(order['data'][0]['id_decor'] - 1);
  document.getElementById('edition').value = parseInt(order['data'][0]['edition']);
  document.getElementById('url').value = order['data'][0]['url'];
  document.getElementById("price").innerHTML = "Итого: " + parseInt(order['data'][0]['price']);
  document.getElementById("processed").checked = parseInt(order['processed']);
  document.getElementById("consistent_total").checked = parseInt(order['consistent_total']);
  document.getElementById("printed").checked = parseInt(order['printed']);
  document.getElementById("decored").checked = parseInt(order['decored']);

  //calculate new price
  document.getElementsByTagName("html")[0].addEventListener('mouseover', function(){
    // todo : sale
    let format = parseInt(data['format'][parseInt(document.getElementById('format').selectedIndex)]['price']);
    let quality = parseInt(data['quality'][parseInt(document.getElementById('quality').selectedIndex)]['price']);
    let decor = parseInt(data['decor'][parseInt(document.getElementById('decor').selectedIndex)]['price']);
    let edition = parseInt(document.getElementById('edition').value);
    price = (format + quality + decor)*edition;
    document.getElementById("price").innerHTML = "Итого: " + price;
  });

  //update tables
  document.getElementById('save').addEventListener('click', function(){
    $.ajax({
        url: 'create.php',
        type: "POST",
        data: {
          'type': 'edit_post',
          'lock': LOCK,
          'id_order': id_order,
          'id_format': parseInt(document.getElementById('format').selectedIndex + 1),
          'id_quality': parseInt(document.getElementById('quality').selectedIndex + 1),
          'id_decor': parseInt(document.getElementById('decor').selectedIndex + 1),
          'url': document.getElementById('url').value,
          'price': price,
          'edition': parseInt(document.getElementById('edition').value),
          'processed': document.getElementById('processed').checked ? 1 : 0,
          'consistent_total': document.getElementById('consistent_total').checked ? 1 : 0,
          'printed': document.getElementById('printed').checked ? 1 : 0,
          'decored': document.getElementById('decored').checked ? 1 : 0
        },
        success: function(r) {
          console.log(r);
          if(r == "error"){
            alert("Ошибка!");
          }else{
            alert("Успешно!");
          }
          window.location = "/";
        },
        error: function() {
          console.log("ERROR: AJAX");
        },
        async: false
    });
  });
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
    orders += `<option> id_order: ` + data[i]['id_order'] + ";  id_user: " + data[i]['id_user'] + ";  created: " + data[i]['created_at'] + ` </option>`;
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
    let id_order = data[parseInt(document.getElementById('orders').selectedIndex)]['id_order'];
    $.ajax({
        url: 'create.php',
        type: "POST",
        data: {
          'type': 'edit_get_orders_data',
          'id_order': id_order
        },
        success: function(r) {
          admin_edit_order(r, id_order);
        },
        error: function() {
          console.log("ERROR: AJAX");
        },
        async: false
    });
  });
}
