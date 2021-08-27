let login = (event) =>{
	event.preventDefault();
	let jsonString ={
		'userName' : $('input[name=userName]').val(),
		'password' : $('input[name=password]').val()
	};
	$.ajax({
		type: 'post',
		url: '/ecsite/api/login',
		data: JSON.stringify(jsonString),
		//行が一行抜けていたため、ブラウザエラー「 ajax connrcted error 」
		contentType:'application/json',
		datatype:'json',
		scriptCharset: 'utf-8'
	})
	.then((result) => {
		let user =JSON.parse(result);
		$('#welcome').text(` --ようこそ！ ${user.fullName} さん`);
		$('#hiddenUserId').val(user.id);
		$('input[name=userName]').val('');
		$('input[name=password]').val('');
	}, () => {
		console.error('Error:ajax connection failed.');
	}
	);
};

let addCart = (event) =>{
	let tdList = $(event.target).parent().parent().find('td');
	
	let id = $(tdList[0]).text();
	let goodsName = $(tdList[1]).text();
	let price = $(tdList[2]).text();
	let count = $(tdList[3]).find('input').val();
	
	if(count === '0' || count === ''){
		alert('注文数が0または空欄です。');
		return;
	} 
	
	let cart = {
		'id':id,
		'goodsName' : goodsName,
		'price' : price,
		'count' :count
	};
	cartList.push(cart);
	
	let tbody = $('#cart').find('tbody');
	$(tbody).children().remove();
	cartList.forEach(function(cart,index){
		let tr =$('<tr />');
		
		$('<td />',{ 'text': cart.id }).appendTo(tr);
		$('<td />',{ 'text': cart.goodsName }).appendTo(tr);
		$('<td />',{ 'text': cart.price }).appendTo(tr);
		$('<td />',{ 'text': cart.count }).appendTo(tr);
		let tdButton = $('<td />');
		$('<button />',{
			'text': 'カート削除',
			'class':'removeBtn',
		}).appendTo(tdButton);
		
		$(tdButton).appendTo(tr);
		$(tr).appendTo(tbody);
	});
	$('.removeBtn').on('click',removeCart);
};



let buy =　(event) => {
	$.ajax({
		type: 'post',
		url: '/ecsite/api/purchase',
		//JSON.stringfy is not afunction 空白があったため
		data: JSON.stringify({
			"userId": $('#hiddenUserId').val(),
			"cartList": cartList
		}),
		contentType: 'application/json',
		datatype: 'json',
		scriptCharset: 'utf-8'
	})
	.then((result) =>　{
		alert('購入しました。');
	},() =>{
		console.error('Eroor: ajax connection failed.');
	}
	);
};

let removeCart = (event) => {
	const tdList =$(event.target).parent().parent().find('td');
	let id = $(tdList[0]).text();
	cartList = cartList.filter(function(cart){
		return cart.id !==id;
	});
	$(event.target).parent().parent().remove();
};


let showHistory = () =>{
	$.ajax({
		type: 'post',
		url: '/ecsite/api/history',
		
		//usesrId誤字→java.lang.NumberFormatException: null
		//JSはクライアントサイドスクリプト（ブラウザに読み込まれる際に実行）のため、コードの修正時にはキャッシュを削除しないと修正結果が反映しない。
		
		
		data: JSON.stringify({ "userId": $('#hiddenUserId').val() }),
		contentType: 'application/json',
		datatype: 'json',
		scriptCharset: 'utf-8'
	})
	.then((result) =>{
		let historyList = JSON.parse(result);
		let tbody = $('#historyTable').find('tbody');
		$(tbody).children().remove();
		//index id decleard  but its value is never read→　addメソッドでもでてるからOK　気にしない
		historyList.forEach((history, index) => {
			let tr = $('<tr />');
			
			$('<td />',{ 'text': history.goodsName　}).appendTo(tr);
			$('<td />',{ 'text':　history.itemCount }).appendTo(tr);
			$('<td />',{ 'text':　history.createdAt　}).appendTo(tr);
			
			$(tr).appendTo(tbody);
		});
		//シングルクォーテーションだった　history
		$("#history").dialog("open");
	}, () => {
		console.error('Error: ajax connection failed');
	}
	);
};


