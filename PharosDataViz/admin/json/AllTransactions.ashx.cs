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
    /// Summary description for AllTransactions
    /// </summary>
    public class AllTransactions : IHttpHandler
    {
        public class tran_info
        {
            public string tran_id { get; set; }
            public string user_id { get; set; }
            public string netid { get; set; }
            public string first_names { get; set; }
            public string last_name { get; set; }
            public DateTime release_time { get; set; }
            public string job_name { get; set; }
            public float amount { get; set; }
            public int qty { get; set; }
            public int qty2 { get; set; }
            public string device_name { get; set; }
            public string tran_type { get; set; }
            public string tran_typename { get; set; }
            public string print_attributes { get; set; }
            public string display_attributes { get; set; }
            public string paper_size { get; set; }
            public string print_group { get; set; }


        }

        public void ProcessRequest(HttpContext context)
        {
            string connectionString = "Data Source= RICH-INTERN1-PC;Initial Catalog=master; Integrated Security = true;Database=PharosDataSample";
            string sql = "";
            sql = "select * from pharos_transactions Order By time_released DESC ";
            List<tran_info> L = new List<tran_info>();
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("", conn))
                {
                    cmd.CommandText = sql;
                    SqlDataReader reader = cmd.ExecuteReader();

                    while (reader.Read())
                    {
                        tran_info x = new tran_info();
                        /*
                         *   public string tran_id { get; set; }
            public string user_id { get; set; }
            public string netid { get; set; }
            public string first_names { get; set; }
            public int last_names { get; set; }
            public DateTime timereleased { get; set; }
            public string job_name { get; set; }
            public float amount { get; set; }
            public int qty { get; set; }
            public int qty2 { get; set; }
            public string device_name { get; set; }
            public string tran_type { get; set; }
            public string tran_typename { get; set; }
            public string print_attributes { get; set; }
            public string display_attributes { get; set; }
            public string paper_size { get; set; }
            public string print_group { get; set; }
                         * /
                         * */
                        x.netid = reader["netid"].ToString();
                        x.tran_id = reader["transaction_id"].ToString();
                        x.user_id = reader["user_id"].ToString();

                        x.first_names = reader["first_names"].ToString();
                        x.last_name = reader["last_name"].ToString();
                        x.release_time = Convert.ToDateTime(reader["time_released"].ToString());
                        x.job_name = reader["job_name"].ToString();
                        x.amount = float.Parse(reader["amount"].ToString());
                        x.qty = Int32.Parse(reader["qty"].ToString());
                        x.qty2 = Int32.Parse(reader["qty2"].ToString());
                        x.device_name = reader["device_name"].ToString();
                        x.tran_type = reader["transaction_type"].ToString();
                        x.tran_typename = reader["transaction_typename"].ToString();
                        x.print_attributes = reader["print_attributes"].ToString();
                        x.display_attributes = reader["display_attributes"].ToString();
                        x.paper_size = reader["paper_size"].ToString();
                        x.print_group = reader["print_group"].ToString();

                        L.Add(x);

                    }
                }
                //Dictionary<String, Object> d = new Dictionary<String, Object>();
                //d["Title"] = "TransactionsByDate";
                //d["Items"] = "                    

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