from flask import Flask, request, render_template
import requests
from ebay_oauth_token import OAuthToken

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

#Get search result
@app.route('/form', methods=['GET'])
def findItems():
    Keywords=request.args.get('Keywords')
    sortOrder=request.args.get('sortOrder')
    MinPrice=request.args.get('MinPrice')
    MaxPrice=request.args.get('MaxPrice')
    ReturnsAcceptedOnly=request.args.get('ReturnsAcceptedOnly')
    FreeShippingOnly=request.args.get('FreeShippingOnly')
    ExpeditedShippingType=request.args.get('ExpeditedShippingType')
    Condition=request.args.getlist('condition')


    #print(Keywords)
    params={
        'OPERATION-NAME': 'findItemsAdvanced',
        'SERVICE-VERSION': '1.0.0',
        'SECURITY-APPNAME': 'JinzheHa-sharonpa-PRD-dd9ea8859-42b1d265',
        'RESPONSE-DATA-FORMAT': 'JSON',
        'keywords': Keywords,
        #'paginationInput.entriesPerPage': 30,
        'sortOrder': sortOrder,
    }

    i=0
    if MinPrice:
        params['itemFilter('+str(i)+').name']='MinPrice'
        params['itemFilter('+str(i)+').value']=MinPrice
        params['itemFilter('+str(i)+').paramName'] = 'Currency'
        params['itemFilter('+str(i)+').paramValue'] = 'USD'
        i+=1
       
    if MaxPrice:
        params['itemFilter('+str(i)+').name']='MaxPrice'
        params['itemFilter('+str(i)+').value']=MaxPrice
        params['itemFilter('+str(i)+').paramName'] = 'Currency'
        params['itemFilter('+str(i)+').paramValue'] = 'USD'
        i+=1
    
    if ReturnsAcceptedOnly:
        params['itemFilter('+str(i)+').name']='ReturnsAcceptedOnly'
        params['itemFilter('+str(i)+').value']=ReturnsAcceptedOnly
        i+=1
    
    if FreeShippingOnly:
        params['itemFilter('+str(i)+').name']='FreeShippingOnly'
        params['itemFilter('+str(i)+').value']=FreeShippingOnly
        i+=1

    if ExpeditedShippingType:
        params['itemFilter('+str(i)+').name']='ExpeditedShippingType'
        params['itemFilter('+str(i)+').value']=ExpeditedShippingType
        i+=1

    if Condition:
        params['itemFilter('+str(i)+').name']='Condition'
        for j in range(len(Condition)):
            params['itemFilter('+str(i)+').value('+str(j)+')']=Condition[j]
    print(Condition)
    print(params)
    result = requests.get('https://svcs.ebay.com/services/search/FindingService/v1', params=params)
    print(result.url)
    return result.text



@app.route('/singleItem', methods=['GET'])
def singleItem():
    #Get single item
    client_id = "JinzheHa-sharonpa-PRD-dd9ea8859-42b1d265"
    client_secret = "PRD-d9ea8859a787-66ca-4f70-b1b1-740c"
    # Create an instance of the OAuthUtility class
    oauth_utility = OAuthToken(client_id, client_secret)
    # Get the application token
    application_token = oauth_utility.getApplicationToken()

    headers = {
    "X-EBAY-API-IAF-TOKEN": oauth_utility.getApplicationToken()
    }
    id=request.args.get('itemId')
    print(id)
    singlePara={
        'callname': 'GetSingleItem',
        'responseencoding': 'JSON',
        'appid': 'JinzheHa-sharonpa-PRD-dd9ea8859-42b1d265',
        'siteid': '0',
        'version': '967',
        'ItemId': id,
        'IncludeSelector': "Description.Details,ItemSpecifics"
    }
    response = requests.get('https://open.api.ebay.com/shopping', params=singlePara, headers=headers)
    print(response.status_code)
    print(response.url)
    return response.text
