$("#serch-btn").on('click', function () {
	var $keyword = $(".input").val();
	console.log($keyword);

	search($keyword);
});

function search(keyword) {

	$.ajax({
		type: "GET",
		url: "https://app.rakuten.co.jp/services/api/IchibaItem/Search/20140222",
		data: {
			applicationId: "1066586154280401238",
			affiliateId: "14b5fa3e.f91cdd3a.14b5fa3f.c2623db2",
			keyword : keyword
		}
	}).done(function(data) {
		createContents(data);
	})
};

function createContents(data) {
    console.log(data);
    $('#container').empty();

    var dataStat = data.count;
    if (dataStat > 0) {
        $.each(data.Items, function (i, items) {
            var item = items.Item;
            var affiliateUrl = item.affiliateUrl;
            var imageUrl = item.mediumImageUrls[0].imageUrl;
            var itemName = item.itemName;
            if (itemName.length > 20) {
                itemName = itemName.substring(0, 20) + '...';
            }
            var itemPrice = item.itemPrice;
            var htmlTemplate = $(
                '<div class="grid">' +
                    '<a>' +
                        '<div class="imgholder swing">' +
                          '<img src="' + imageUrl + '" alt="' + item.itemName + '" width="128" ' + 'height="128"/>' +
                        '</div>' +
                        '<h5>' + itemName + '</h5>' +
                        '<div class="meta">' + itemPrice + '円</div>' +
                    '</a>' +
                '</div>');

            //テンプレートを追加
            $('#container').append(htmlTemplate);

        });
    };//each
};