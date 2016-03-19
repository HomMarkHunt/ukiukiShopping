var $keyword = null;
var $page = 1;

$("#serch-btn").on('click', function () {
	$keyword = $("#input").val();
	console.log($keyword);
    $('#container').empty();

    if ($keyword) {
        return false;
    }

	search($keyword, $page);
});

function search(keyword, page) {
    displayLoader();
	$.ajax({
		type: "GET",
		url: "https://app.rakuten.co.jp/services/api/IchibaItem/Search/20140222",
		data: {
			applicationId: "1066586154280401238",
			affiliateId: "14b5fa3e.f91cdd3a.14b5fa3f.c2623db2",
			keyword : keyword,
            page : page
		}
	}).success(function(data) {
		createContents(data);
	}).complete(function() {
        removeLoader();
    })
};

function createContents(data) {
    console.log(data);
    // $('#container').empty();

    var dataStat = data.count;
    $("p.hidden").removeClass("hidden");
    $("span #hit-result").text(dataStat.toLocaleString() + "件");
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
                '<div class="grid label left">' +
                    '<a>' +
                        '<span>Lo</span>' +
                        '<div class="imgholder swing">' +
                          '<img class="item-img" src="' + imageUrl + '" alt="' + item.itemName + '"/>' +
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

// 画面下部で検索する
$(window).on("scroll", function() {
    if ($page !== 0) {
        return false;
    }

    var scrollHeight = $(document).height();
    var scrollPosition = $(window).height() + $(window).scrollTop();
    if ((scrollHeight - scrollPosition) / scrollHeight === 0) {
        $page += 1;

        search($keyword, $page);
    }
});

// ローダー表示
function displayLoader() {
    if ($("#loading").size() === 0) {
        $("body").append("<div id='loading'><img class='loaderIcon' src='./img/loader.gif'/></div>");
    }
}

// ローダー非表示
function removeLoader() {
    $("#loading").remove();
}

