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
    /// Summary description for TransactionsByDate
    /// </summary>
    public class TransactionsByDate : IHttpHandler
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

            string sStartDate = "08-24-2015";
            string sEndDate = "12-16-2015";
            //string sStartDate = "";
            //string sEndDate = "";

            string usStartDate = "";
            string usEndDate = DateTime.Today.ToString("MM-dd-yy");
            float quota = -1;

            if (!String.IsNullOrEmpty(context.Request["uStartDate"]))
            {
                usStartDate = context.Request["uStartDate"];
            }

            if (!String.IsNullOrEmpty(context.Request["uEndDate"]))
            {
                usEndDate = context.Request["uEndDate"];
            }

            if (!String.IsNullOrEmpty(context.Request["Quota"]))
            {
                quota = float.Parse(context.Request["Quota"]);
            }



            if (!String.IsNullOrEmpty(context.Request["StartDate"]))
            {
                sStartDate = context.Request["StartDate"];
            }

            if (!String.IsNullOrEmpty(context.Request["EndDate"]))
            {
                sEndDate = context.Request["EndDate"];
            }


            string sql = "select COUNT(*) as counts , CONVERT(DATE,time_released) as time_released from pharos_S_transactions ";
            string constraints = " where time_released >= '{0}' and time_released <= '{1}' ";
            string order = "Group by CONVERT(DATE,time_released) ORDER BY CONVERT(DATE, time_released) ASC";
            string user_constraints = " and user_id in (select user_id from pharos_ADD_transactions where time_released >= '{2}' and time_released <= '{3}' and amount = {4}) ";
            string where_user_constraints = " where user_id in (select user_id from pharos_ADD_transactions where time_released >= '{2}' and time_released <= '{3}' and amount = {4} )";

            if (quota > 0) // if greater than zero, we need to add another paramter to check for certain users
            {
               
                if (sStartDate != "" && sEndDate != "")
                {
                    sql = sql + constraints + user_constraints + order;
                    sql = String.Format(sql, sStartDate, sEndDate, usStartDate, usEndDate, quota);
                    System.Diagnostics.Debug.WriteLine(sql);
                }
                else
                {
                    sql = sql + where_user_constraints + order;
                    sql = String.Format(sql, sStartDate, sEndDate, usStartDate, usEndDate, quota);
                }


            }
            else
            {
                // do other normal stuff
                if (sStartDate != "" && sEndDate != "")
                {
                    sql = sql + constraints + order;
                    sql = String.Format(sql, sStartDate, sEndDate);
                    System.Diagnostics.Debug.WriteLine(sql);
                }
                else
                {
                    sql = sql + order;
                    System.Diagnostics.Debug.WriteLine(sql);
                }
            }
            //where ReservationStatus <> 'Cancelled' and  StartDate>='{0}' and EndDate<='{1}'

            Dictionary<String, Object> json_dict = new Dictionary<string, Object>();

            List<Dictionary<String, dynamic>> L = new List<Dictionary<string, dynamic>>();
            
            
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("", conn))
                {
                    cmd.CommandText = sql;
                    SqlDataReader reader = cmd.ExecuteReader();

                    while (reader.Read())
                    {
                        Dictionary<String, dynamic> d = new Dictionary<string, dynamic>();
                        d["Key"] = reader["time_released"].ToString();
                        d["Value"] = int.Parse(reader["counts"].ToString());
                        L.Add(d);

                    }
                }
                //Dictionary<String, Object> d = new Dictionary<String, Object>();
                // d["Title"] = "TransactionsByDate";
                //d["Items"] = "            "        

                json_dict["Title"] = "Transactions By Date";
                json_dict["Items"] = L;

                string json = JsonConvert.SerializeObject(json_dict);
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