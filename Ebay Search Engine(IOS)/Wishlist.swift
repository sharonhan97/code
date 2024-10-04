import Foundation
import Combine
import SwiftUI
import SwiftyJSON

class Wishlist: ObservableObject{
    @Published var wishlist = Set<String>()
    @Published var list:[Result] = []
    @Published var totalprice:Float = 0.0
    @Published var totalnum:Int=0
    @Published var isReady = false
    
    func addwish(item: Result){
        guard let url=URL(string: "https://hw4jg24ighyo.wl.r.appspot.com/api/addwish")else{
            print("wrong url")
            return
        }
        
        var request=URLRequest(url:url)
        request.httpMethod="POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        let encoder = JSONEncoder()
        do {
            let jsonData = try encoder.encode(item)
            request.httpBody = jsonData
            
            let task = URLSession.shared.dataTask(with: request) { data, response, error in
                if let error = error {
                    print("Error sending wishlist item: \(error)")
                    return
                }
            }
            task.resume()
            
        }catch {
            print("Error encoding wishlist item: \(error)")
        }
        self.wishlist.insert(item.itemId!)
        print(self.wishlist)
    }
    
    func deletewish(itemId: String){
        
        guard let url=URL(string: "https://hw4jg24ighyo.wl.r.appspot.com/api/deletewish?itemId=\(itemId)")else{
            print("wrong url")
            return
        }
        let request=URLRequest(url:url)
        let task=URLSession.shared.dataTask(with: request){data, response, error in
            if let error = error{
                print("Error fetch zipcode",error)
                return
            }
            guard let data=data else{
                print ("No data in response")
                return
            }
            print(data)
        }
        task.resume()
        DispatchQueue.main.async {
            self.wishlist.remove(itemId)}
    }
    
    func getwish(){
        guard let url=URL(string: "https://hw4jg24ighyo.wl.r.appspot.com/api/getwish")else{
            print("wrong url")
            return
        }
        let request=URLRequest(url:url)
        let task=URLSession.shared.dataTask(with: request){data, response, error in
            if let error = error{
                print("Error fetch zipcode",error)
                return
            }
            if let data=data{
                DispatchQueue.main.async {
                    do {
                        let decodedData = try JSONDecoder().decode([Result].self, from: data)
                        self.list = decodedData
                        print(self.list)
                        self.totalprice = 0.0
                        self.totalnum = 0
                        for item in decodedData {
                            if let price = Float(item.price!) {
                                self.totalprice += price
                            }
                            self.totalnum += 1
                        }
                        self.isReady = true
                    } catch {
                        print("Error decoding: \(error)")
                    }
                }
            }
        }
        task.resume()
        
    }
    
    
}
