var keyword = null;
var $page = 1;

$("#serch-btn").on('click', function () {
    $page = 1;
	keyword = $("#input").val();
	console.log(keyword);
    $('#container').empty();

    if (!keyword) {
        return false;
    }

	search(keyword, $page);
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
        $page += 1;
        removeLoader();
    })
};

function createContents(data) {
    console.log(data);

    var dataStat = data.count;
    if ($page == 1) {
        $("p.hidden").removeClass("hidden");
        $("#hit-result").text(dataStat.toLocaleString() + "件");
    }
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
                '<a href="#" class="grid label left showoverlay">' +
                    '<img class="brand-logo" src="./img/rakuten.jpeg"/>' +
                    '<div class="imgholder swing">' +
                      '<img class="item-img" src="' + imageUrl + '" alt="' + item.itemName + '"/>' +
                    '</div>' +
                    '<h5>' + itemName + '</h5>' +
                    '<div class="meta"><h4>' + itemPrice + '円</h4></div>' +
                    '<div class="hidden url">' + affiliateUrl + '</div>' +
                    '<div class="hidden full-item-name">' + item.itemName + '</div>' +
                '</a>');

            //テンプレートを追加
            $('#container').append(htmlTemplate);

        });
    };//each
};

// 画面下部で検索する
$(window).on("scroll", function() {
    if ($page == 1) {
        return false;
    }

    var scrollHeight = $(document).height();
    var scrollPosition = $(window).height() + $(window).scrollTop();
    if ((scrollHeight - scrollPosition) / scrollHeight === 0) {
        search(keyword, $page);
    }
});

// 検索ボタン表示
function displaySearchBtn() {
    $("#serch-btn").addClass("hidden");
}

// 検索ボタン非表示
function hideSearchBtn() {
    $("#serch-btn").removeClass("hidden");
}

// ローダー表示
function displayLoader() {
    if ($("#loading").size() == 0) {
        $("body").append("<div id='loading'><img class='loaderIcon' src='./img/loader.gif'/></div>");
    }
}

// ローダー非表示
function removeLoader() {
    $("#loading").remove();
}

// メーラー起動
$("a.head").on('click', function() {
    var address = 'ukiukitechsuppo@yahoo.co.jp';
    var subject = 'Comment or Question';
    var body = '';
    location.href = 'mailto:' + 'ukiukitechsuppo@yahoo.co.jp' + '?subject=' + 'Comment or Question' + '&body=' + '';
})

convertToModal = function(e) {
    var itemName = $(e).children("div.full-item-name").text();
    var itemUrl = $(e).children("div.url").text();
    var imasrc = $(e).children('div.imgholder').children('img').attr('src');
    var price = $(e).children('div.meta').children('h4').text();

    $("p#item-name").text(itemName);
    $("img#item-img").attr('src', imasrc);
    $("p#price").text(price);
    $("a#to-url").attr('href', itemUrl);
}
var $current_scrollY;
//クリックイベント
$("#container").on('click', 'a.showoverlay', (function() {
    // 背景固定
    $current_scrollY = $( window ).scrollTop();

    $('div.main-contents').css( {
        position: 'fixed',
        width: '100%',
        top: -1 * $current_scrollY
    } );
    //オーバーレイ用のボックスを作成
    $("body").append("<div id='overlay'></div>");
    convertToModal(this);
    //フェードエフェクト
    $("#overlay").fadeTo(500, 0.7);
    $("#modalbox").fadeIn(500);
}));

//閉じる際のクリックイベント
$("#close").click(function() {
    $('div.main-contents').attr( { style: '' } );
    $('html, body').prop( { scrollTop: $current_scrollY } );

    $("#modalbox, #overlay").fadeOut(500, function() {
        $("#overlay").remove();
    });

});

$(window).resize(function() {
    //ボックスサイズ
    $("#modalbox").css({
        top: ($(window).height() - $("#modalbox").outerHeight()) / 3,
        left: ($(window).width() - $("#modalbox").outerWidth()) / 2
    });
});
$(window).resize();
