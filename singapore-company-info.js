
class SingaporeCompanyInfo {

    _urls = {
        dataGovSg : 'https://data.gov.sg/api/action/datastore_search',
        geo : 'https://nominatim.openstreetmap.org/search.php',
        acraSSIC : {
            a : '6b5cbfa7-b502-4ce6-875d-dafff7ff04f2',
            b : '3b8539bb-5c22-4540-a420-86db444810d3',
            c : '9458197b-4b46-480e-a596-34dbff26d8dc',
            d : '61a4bfe4-6cf6-4aa0-8c7c-05e53bddd182',
            e : 'b8e67c3e-2876-48d7-930b-6702bbdac16c',
            f : 'ada9a1fa-c1d8-41a0-80f6-982334c1cf32',
            g : 'c5fdba9e-5e7c-47b3-9f47-bdd5266a3a9b',
            h : '86d54336-c9ef-48a8-9f6b-47053aa5c223',
            i : '250da61b-4509-4b15-a084-49b1935438af',
            j : '2e484f26-d31c-4484-9033-77d307025a3e',
            k : '269d499f-8173-44ae-b956-14d7bd2014d4',
            l : 'fef20b0b-a8bf-4ac5-b8f9-280a05d7537a',
            m : '8bb8c3ef-8562-4ab0-8853-200fa82587d7',
            n : '38282e84-8a21-4932-a968-fe04a3bee4d0',
            o : '24986e7f-17bf-4058-a247-5b916e213ff5',
            p : '67e879b2-84e4-4353-9904-3fa3c004deba',
            q : '67727849-f41c-4eff-b5c0-d58c0f6b468e',
            r : 'c666507e-44e2-49fa-a86c-2719c14bbbdc',
            s : '855613c8-c1cf-4b54-9ec4-2ae15b798a44',
            u : 'b533039b-5002-4f45-bd11-632c47f7cdfa',
            t : '15ffcdd1-6cc9-48d6-bbb4-cfc7e9b0aa46',
            v : 'a740cd7d-8c08-4825-bcdc-b5c8d2a80a81',
            w : '15b43f42-139c-4c31-a607-44c20f44d1c1',
            x : '903aa558-bf4b-4ab0-8eed-5a5a00af0618',
            y : '4629432d-6bbd-4381-88b3-1dd2dabb0c18',
            z : 'eaa3a71f-6bc9-40a1-a1c6-baf034dc1ac0',
            other : 'e8732ea3-adca-4ca0-9fef-2b90c7a24f06'
        },
        acraUEN : {
            main : 'bdb377b8-096f-4f86-9c4f-85bad80ef93c',
            other : '5ab68aac-91f6-4f39-9b21-698610bdf3f7'
        }
    }

    constructor(limit) {

        this.limit = limit || 20;
        return this;

    }



    getCompany(name, callback) {

        const result = [];
        const limit = this.limit;
        const _this = this;
    
        _this.loadData(`${_this._urls.dataGovSg}?resource_id=${_this._urls.acraUEN.main}&limit=${limit}&q=${name}`, function(main){
    
            _this.loadData(`${_this._urls.dataGovSg}?resource_id=${_this._urls.acraUEN.other}&limit=${limit}&q=${name}`, function(other){
    
                for (let i in main.result.records) {
    
                    result.push(main.result.records[i])
    
                }
    
                for (let i in other.result.records) {
    
                    result.push(other.result.records[i])
    
                }    
    
                callback(result);
    
            })  
    
        })   
        
        return this;
    
    }

    getInfo(name, uen, callback) {

        const result = [];
        const url = ( /\D/.test( name[0] ) ) ? name[0].toLowerCase() : 'other';
        const _this = this;
    
        _this.loadData(`${_this._urls.dataGovSg}?resource_id=${_this._urls.acraSSIC[url]}&q=${uen}`, function(info){
    
            for (let i in info.result.records[0]) {
    
                result[i] = info.result.records[0][i]
    
            }

            if (result.street_name && result.street_name != 'na') {

                _this.getGeo(result.street_name, result.block, function(geo){

                    if (geo.length) {
                        
                        result.osm = geo[0];

                    }   

                    callback(result);

                })

            } else if (result.reg_street_name && result.reg_street_name != 'na') {

                _this.getGeo(result.reg_street_name, result.block, function(geo){

                    if (geo.length) {
                        
                        result.osm = geo[0];

                    }   

                    callback(result);

                })

            } else {    
    
                callback(result);

            }
    
        })
        
        return this;
    
    }   

    getGeo(street, block, callback) {

        const address = (block) ? `${block}%2F${street.replace(/\s+/gi, '+')}` : street.replace(/\s+/gi, '+');
        const _this = this;
    
        _this.loadData(`${_this._urls.geo}?street=${address}&city=singapore&format=json`, function(geo){
            callback(geo)
        })    
    
        return this;
    }

    loadData(url, callback) {
    
        if (window.fetch){
          fetch(url)
          .then(response => response.json())
          .then(function(data) {
    
            callback(data);
    
          });
          
        } else {
          $.ajax({
          type: 'GET',
          url: url,
          dataType: 'json',
          success: function (data) {
              
            callback(data);  
    
            }
          });
        }

        return this;
        
    }

}        
