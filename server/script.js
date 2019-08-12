var express = require("express");
var mysql = require("mysql");

var app = express();

var connection = mysql.createPool({
  //properties
  connectionLimit: 50,
  host: "localhost",
  user: "root",
  password: "",
  database: "talking street"
});
var image_url;
var rows_info = [];
var distinctpost_id = [];
var k = 0,
  l,
  x;
  var flag =0;
var loc = "pune",
  cus = "snacks";

    var title_places = [
    {
      title: "",
      description: "",
      url: "",
      img : "",
    }
  ];

// The SQL query part

app.get("/location/:location/:cuisine/outlets", function(req, resp) {
  loc = req.params.location.toLowerCase();
  cus = req.params.cuisine.toLowerCase();
  console.log("User interested location " + loc +" cuisine " + cus);
  connection.getConnection(function(error, tempCont) {
    if (error) {
      tempCont.release();
      console.log("Error in query");
    } else 
    {
      console.log("Successful query i.e inside get connection function\n");
      var results1;
      var temp = [];

      //getting blogs query

      tempCont.query(
        `SELECT DISTINCT ID FROM wp_posts LEFT JOIN wp_term_relationships ON (wp_posts.ID = wp_term_relationships.object_id) LEFT JOIN wp_term_taxonomy ON (wp_term_relationships.term_taxonomy_id = wp_term_taxonomy.term_taxonomy_id) WHERE post_type = "post" AND post_status ="publish" AND wp_term_taxonomy.term_id IN (72,73,74,75)`,
        function(error, rows, fields) {
          console.log("after the query that fetches blogs");

          for (var i = 0; i < rows.length; i++) {
            temp[i] = rows[i].ID;
          }

          results1 = JSON.stringify(temp);
          var length_row;
		// getting the outlets

            tempCont.query(`SELECT DISTINCT
				  id,post_author,post_title,post_name AS "link"
			   
				  ,(SELECT p.guid FROM wp_postmeta2 AS pm INNER JOIN wp_posts AS p ON pm.meta_value=p.ID WHERE pm.post_id = "'.$id.'" AND pm.meta_key = "_thumbnail_id") AS "image_url"
				  ,(SELECT group_concat(wp_terms.name separator ", ") 
				  FROM wp_terms
				  INNER JOIN wp_term_taxonomy on wp_terms.term_id = wp_term_taxonomy.term_id
				  INNER JOIN wp_term_relationships wpr on wpr.term_taxonomy_id = wp_term_taxonomy.term_taxonomy_id
				  WHERE taxonomy= "location" and wp_posts.ID = wpr.object_id
				  ) AS "location"
				  ,(SELECT group_concat(wp_terms.name separator ", ") 
				  FROM wp_terms
				  INNER JOIN wp_term_taxonomy on wp_terms.term_id = wp_term_taxonomy.term_id
				  INNER JOIN wp_term_relationships wpr on wpr.term_taxonomy_id = wp_term_taxonomy.term_taxonomy_id
				  WHERE taxonomy= "cuisine" and wp_posts.ID = wpr.object_id
				  ) AS "cuisine"
				
				  FROM wp_posts
				  WHERE post_type = "post" AND id NOT IN (509,6672,6682,8213,8224,8987,9104,9391,9809,10259,10550,10554,10579,10744,10941,11131,11186,11219,11494,11521,11549,11684,11852,11865,12042,12162,13080,13389,13464,13475,13508,13518,13524,13552,13562,13590,14254,14359,14496,14521,14551,14578,14807,14868,15222,15375,15381,15502,15539,15563,15574,15578,15627,15685,15713,15745,15839,15840,15903,15921,15934,15991,15996,16062,16088,16137,16194,16247,16291,16311,16321,16361,16383,16635,16733,16852,16969,16994,17160,17172,17189,17238,17241,17250,17254,17256,17271,17277,17343,17444,17450,17577,17589,17707,17738,17767,17785,17804,17814,17840,17847,18065,18071,18176,18185,18189,18204,18218,18224,18228,18240,18248,18251,18254,18269,18275,18281,18287,18290,18432,18436,18439,18525,18545,18630,18703,18740,19010,19068,19517,19639,19643,19723,19871,19876,19879,19886,19893,19962,20173,20316,20701,20797,20858,20918,20993,21024,21318,21320,21337,21420,21432,21692,21932,22051,22056,22140,22142,22156,22164,22166,22173,22185,22187,22194,22206,22208,22220,22227,22229,22241,22248,22388)
				  ORDER BY
				  id`, function(error, rows, fields) {
				  					  	
                    var list = Object.keys(rows);
                     list.forEach(element => {
                      k = 0;
                       if(flag<4){
                      if (!!rows[element].location && !!rows[element].cuisine && !!rows[element].location.toLowerCase().includes(loc) && !!rows[element].cuisine.toLowerCase().includes(cus)) {
                       	var id2 = rows[element].id;

                        
                        
                         tempCont.query(`SELECT guid FROM wp_postmeta2 AS pm INNER JOIN wp_posts AS p ON pm.meta_value=p.ID WHERE pm.post_id = ${id2} AND pm.meta_key = "_thumbnail_id"`, function(error, r, fields) {
	                 				 
	                 				 var lst = Object.keys(r);
                     						lst.forEach(element =>{
	                 				 	image_url = r[element].guid;

	                 				 })
	                 				 console.log("image url is ^^^^^^^^^^^^^^^^^\n\n\n" )
	                 				 	console.log(image_url);

	                 				 	var obj = {
				                          title: rows[element].post_title,
				                          description : rows[element].location,
				                          url: "https://talkingstreet.in/outlet/" + rows[element].link,
				                          img : image_url,
				                        };

				                        title_places.push(obj);
				                        console.log("pusing object *************** ")
				                        console.log(obj);

	                 				 	flag++;
										console.log(obj);
                        				if(flag==3){
                         	 				resp.send(title_places);
                        	}

	               		 })
                        
                      }
                  }

                })

	  			})

            
          
        }
      ); 
 	 		
    }
  });
});

//Here ends the sql query part

app.listen(1337);
