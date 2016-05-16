using Newtonsoft.Json;
using System.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace PharosDataViz.admin.json
{
    /// <summary>
    /// Summary description for AllUsers
    /// getting al lthe d
    /// </summary>
    public class AllUsers : IHttpHandler
    {

        public class user_info
        {
            public string netid { get; set; }
            public string netid_alias { get; set; }
            public string group_type { get; set; }
            public string role_type { get; set; }
            public int active { get; set; }
            public string billing_option { get; set; }
            public string first_names { get; set; }
            public string last_name { get; set; }
            public string card_id { get; set; }
            public string email { get; set; }
            public DateTime created { get; set; }
        }


        public void ProcessRequest(HttpContext context)
        {
            string connectionString = "Data Source= RICH-INTERN1-PC;Initial Catalog=master;Integrated Security = true;Database=PharosDataSample";
           
            string sql = "";
            sql = "select * from pharos_users";
            List<user_info> L = new List<user_info>();
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("", conn))
                {
                    cmd.CommandText = sql;
                    SqlDataReader reader = cmd.ExecuteReader();

                    while (reader.Read())
                    {
                        user_info x = new user_info();

                        x.netid = reader["netid"].ToString();
                        x.netid_alias = reader["netid_alias"].ToString();
                        x.group_type = reader["group_type"].ToString();
                        x.role_type = reader["role_type"].ToString();
                        x.active = Int32.Parse(reader["active"].ToString());
                        x.billing_option = reader["billing_option"].ToString();
                        x.first_names = reader["first_names"].ToString();
                        x.last_name = reader["last_name"].ToString();
                        x.card_id = reader["card_id"].ToString();
                        x.email = reader["email"].ToString();
                        x.created = Convert.ToDateTime(reader["created"].ToString());
                      
                        L.Add(x);

                    }
                }
                string json = JsonConvert.SerializeObject(L);
                context.Response.ContentType = "text/json";
                context.Response.Write(json);
            }

        }
        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    
    }
}