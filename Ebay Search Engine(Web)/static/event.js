//click logo open a new ebay tab 
$('.Ebay-Logo').click(function(){window.open('https://www.ebay.com', '_blank');});

//click submit
$('form').on('submit',function(e){
    e.preventDefault()

    var minPrice=parseFloat($('#minPrice').val());
    var maxPrice=parseFloat($('#maxPrice').val());
    var formData = $('form').serialize();
    var keywords = $('#keywordInput').val();

    if (minPrice <0.0 || maxPrice<0.0) {
        alert('Price Range values cannot be negative! Please try a value greater than or equal to 0.0');
        return;
    }
    else if (maxPrice<=minPrice){
        alert('Oops! Lower price limit cannot be greater than upper price limit! Please try again.');
        return;
    }
    else{
        //console.log("data",formData)
        $.ajax({
            url: "/form",
            type: "GET",
            data: formData,
            dataType: "json",
            success: function(res){
                console.log(res)
                showList(res,keywords)
            },
            error: function(err){
                console.log("ERROR",err)
            }
        })
    }
}
); 

//clear
$('form').on('reset',function(e){
    e.preventDefault;
    $('form input').val="";
    $('form select').val="";
    $('.itemList').css('display','none');
});

function showList(res,keywords){   
    //clear previous
    $('.itemList>.result').html('');
    $('.itemList>.container').html('');
    
    //result
    if (res.findItemsAdvancedResponse[0].searchResult[0]["@count"]=="0"){
        $('.itemList>.result').html('<h3>No Results Found</h3>');
        $('.itemList>.result').attr('id','noResult');
        $('.itemList').css('display','block');
        return;
    }
    else{
        $('.itemList > .result').html('<h3>' + res.findItemsAdvancedResponse[0].paginationOutput[0].totalEntries + ' Results found for <i>' + keywords + '</i></h3>');
    }

    //list
    var str='';
    var arr=res.findItemsAdvancedResponse[0].searchResult[0].item;
    var cnt=0;
    var i=0;

    while(cnt<10){
        //get and fliter all attributes
        if (i>=arr.length){
            break
        }
        var item=arr[i];
        var id=item.itemId[0]
        var title=item.title;
        if (!item.primaryCategory[0].categoryName){
            i+=1;
            continue;
        }
        var cate=item.primaryCategory[0].categoryName;
        
        if (!item.condition){
            i+=1;
            continue;
        }
        var condition=item.condition[0].conditionDisplayName;
        var price=item.sellingStatus[0].convertedCurrentPrice[0].__value__;
        
        if (item.shippingInfo && item.shippingInfo[0] && item.shippingInfo[0].shippingServiceCost && item.shippingInfo[0].shippingServiceCost[0]){
            var ship=item.shippingInfo[0].shippingServiceCost[0].__value__;
        }
        else{
            var ship="0";
        }
        
        var pic=item.galleryURL;
        if (pic=='https://thumbs1.ebaystatic.com/%20pict/04040_0.jpg'){
            pic='https://csci571.com/hw/hw6/images/ebay_default.jpg'
        }
        var topr=item.topRatedListing;
        var url=item.viewItemURL[0];

        //html part
        str+=`
            <div class="list" data-itemid=${id}>
                <div class="itemPic">
                    <img src=${pic} alt="Picture of good">
                </div>
                <div class="info">
                    <div class="itemName">${title}</div>
                    <div class="itemCate">Category: ${cate} <i class="fa fa-external-link itemLink" data-itemurl=${url} ></i></div>
            `;
        //add top rated 
        if (topr=="true"){
            str+=`  <div class="itemCon">
                        <span>Condition: ${condition}</span>
                        <img src="https://csci571.com/hw/hw6/images/topRatedImage.png" alt="Top Rated" id="rateImg">
                    </div>`
        }
        else{
            str+=`  <div class="itemCon">Condition: ${condition}</div>`
        }
        //add shipping price
        if (parseFloat(ship)>=0.01){
            str+=`                    
                    <div class="itemPrice">Price: $${price}(+ $${ship} for shipping)</div>   
                </div>
            </div>             
            `; 
        }
        else{
            str+=`                    
                    <div class="itemPrice">Price: $ ${price}</div>   
                </div>
            </div>             
            `;  
        }
        cnt+=1;
        i+=1;
    }
    $('.container').html(str);

    //hide 7
    var more=false;
    if ($('.container>.list').length>3){
        $('.container>.list:gt(2)').hide();
        $('.container').append('<button id="expand">Show More</button>');
    }

    //show list
    $('.itemList>.result').removeAttr("id");
    $('.itemList').css('display','block');
   
    //listen click
    $('.itemLink').click(function(e){
        e.stopPropagation();
        console.log('i am clicked')
        var itemlink=$(this).data('itemurl');
        window.open(itemlink, '_blank');
    });
    showMore(more);

    //single item detail
    showDetail();
}

function showMore(more){
    $('#expand').click(function(){
        if (more){
            $('.container>.list:gt(2)').hide();
            $('#expand').text('Show More');
            window.scrollTo({top:0,behavior:"smooth"});
            more=false;
        }
        else{
            $('.container>.list:gt(2)').show();
            $('#expand').text('Show Less');
            window.scrollTo({top: document.documentElement.scrollHeight - window.innerHeight, behavior: "smooth"});
            more=true;
        }
    }
    )

    

}

function showDetail(){
    $('.container .list').click(function(){
        var id=$(this).data('itemid');
        console.log('id',id);
        $.ajax({
            url: "/singleItem",
            type: "GET",
            data: {itemId:id},
            dataType: "json",
            success: function(res){
                console.log(res);
                detailPage(res);
                $('#backButton').click(function(){
                    $('.itemList').css('display','block');
                    $('.detail').css('display','none')
                    $("#detailInfo").empty();
                }
                )
            },
            error: function(err){
                console.log("ERROR",err)
            }
        });
    }
    )
}
function detailPage(res){
    $('.itemList').css('display','none');
    if (res.Item.PictureURL){
        $('#detailInfo').append(`
        <tr>
        <td class="detailkey">Photo</td>
        <td><img  id="detailPic" src="${res.Item.PictureURL[0]}" alt="DetailPhoto"></td>
        </tr>
        `)
    }
    if (res.Item.ViewItemURLForNaturalSearch){
        $('#detailInfo').append(`
        <tr>
        <td class="detailkey">eBay Link</td>
        <td><a href="${res.Item.ViewItemURLForNaturalSearch}" target="_blank">eBay Product Link</a></td>
        </tr>
        `)
    }
    if (res.Item.Title){
        $('#detailInfo').append(`
        <tr>
        <td class="detailkey">Title</td>
        <td>${res.Item.Title}</td>
        </tr>
        `)
    }
    if (res.Item.subtitle){
        $('#detailInfo').append(`
        <tr>
        <td class="detailkey">SubTitle</td>
        <td>${res.Item.subtitle}</td>
        </tr>
        `)
    } 
    if (res.Item.ConvertedCurrentPrice){
        $('#detailInfo').append(`
        <tr>
        <td class="detailkey">price</td>
        <td>${res.Item.ConvertedCurrentPrice.Value} ${res.Item.ConvertedCurrentPrice.CurrencyID}</td>
        </tr>
        `)
    } 
    if (res.Item.Location){
        $('#detailInfo').append(`
        <tr>
        <td class="detailkey">Location</td>
        <td>${res.Item.Location}</td>
        </tr>
        `)
    } 
    if (res.Item.UserId){
        $('#detailInfo').append(`
        <tr>
        <td class="detailkey">Seller</td>
        <td>${res.Item.UserId}</td>
        </tr>
        `)
    } 
    if (res.Item.ReturnPolicy){
        var re=""
        if (res.Item.ReturnPolicy.ReturnsAccepted){
            re+="Returns Accepted ";
        }
        if(res.Item.ReturnPolicy.ReturnsWithin){
            re+="within "
            re+=res.Item.ReturnPolicy.ReturnsWithin;
        }
        $('#detailInfo').append(`
        <tr>
        <td class="detailkey">Return Policy (US)</td>
        <td>${re}</td>
        </tr>
        `)
    }  
    res.Item.ItemSpecifics.NameValueList.forEach(element => {
        $('#detailInfo').append(`
        <tr>
        <td class="detailkey">${element.Name}</td>
        <td>${element.Value[0]}</td>
        </tr>
        `)
    });
    $('.detail').css('display','flex')
}