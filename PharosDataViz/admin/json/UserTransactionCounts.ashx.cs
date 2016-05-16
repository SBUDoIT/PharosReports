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
    /// Summary description for Users
    /// </summary>
    public class UserTransactionCounts : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            string connectionString = "Data Source= RICH-INTERN1-PC;Initial Catalog=master; Integrated Security = true;Database=PharosDataSample";
            string sStartDate = "08-24-2015";
            string sEndDate = "12-16-2015";
            if (!String.IsNullOrEmpty(context.Request["StartDate"]))
            {
                sStartDate = context.Request["StartDate"];
            }

            if (!String.IsNullOrEmpty(context.Request["EndDate"]))
            {
                sEndDate = context.Request["EndDate"];
            }
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


            string sql = @"select  count(distinct(t.transaction_id)) as transaction_number, Sum(t.qty) as page_counts, Sum(t.qty2) as sheet_counts, u.group_type from pharos_users u 
		  INNER join pharos_transactions t on u.user_id = t.user_id ";
            string constraints = " where t.time_released >= '{0}' and t.time_released <= '{1}'  ";
            string where_constraints = " where u.user_id in (select user_id from pharos_ADD_transactions where time_released >= '{2}' and time_released <= '{3}' and amount = {4} )";
            string and_constraints = " and u.user_id in (select user_id from pharos_ADD_transactions where time_released >= '{2}' and time_released <= '{3}' and amount = {4}) ";

            string order_group = " group by group_type";
           
            if (quota > 0) // if greater than zero, we need to add another paramter to check for certain users
            {
                if (sStartDate != "" && sEndDate != "")
                {
                    sql = sql + constraints + and_constraints + order_group;
                    sql = String.Format(sql, sStartDate, sEndDate, usStartDate, usEndDate, quota);
                }
                else
                {
                    sql = sql + where_constraints + order_group;
                    sql = String.Format(sql, sStartDate, sEndDate, usStartDate, usEndDate, quota);
                }
            }
            else
            {
                if (sStartDate != "" && sEndDate != "")
                {
                    // basically users from the start of time of the pharos system
                    sql = sql + constraints + order_group;
                    sql = String.Format(sql, sStartDate, sEndDate, usStartDate, usEndDate, quota);
                }
                else
                {
                    sql = sql + order_group;
                }
            }

            

            System.Diagnostics.Debug.WriteLine(sql);


            Dictionary<String, Object> json_dict = new Dictionary<string, Object>();


            List<Dictionary<String, dynamic>> L = new List<Dictionary<string, dynamic>>();
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("", conn))
                {
                    cmd.CommandText = sql;
                 // ERROR HERE
                    
                    SqlDataReader reader = cmd.ExecuteReader();

                    while (reader.Read())
                    {
                        Dictionary<String, dynamic> o = new Dictionary<string, dynamic>();
                        o["Key"] = reader["group_type"].ToString();
                        o["Value"] = int.Parse(reader["transaction_number"].ToString());
                        o["Value1"] = int.Parse(reader["page_counts"].ToString());
                        o["Value2"] = int.Parse(reader["sheet_counts"].ToString());
                        L.Add(o);
                    }
                }

            }

            json_dict["Title"] = "User Population";
            json_dict["Items"] = L;



            string json = JsonConvert.SerializeObject(json_dict);
            context.Response.ContentType = "text/json";
            context.Response.Write(json);
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