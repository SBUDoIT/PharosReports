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
    /// Summary description for PrintCount
    /// Inactive file. single sided and double sided printing sometimes are counted twice for one single transactions. Data is very inaccurate
    /// </summary>
    public class PrintCount : IHttpHandler
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



            string sql = "select COUNT(*) as count from pharos_transactions ";
            string constraints = " where charindex('Simplex', print_attributes) <> 0 ";
            string order = "and time_released >= '{0}' and time_released <= '{1}'";
         

            string user_constraints = " and user_id in (select user_id from pharos_ADD_transactions where time_released >= '{2}' and time_released <= '{3}' and amount = {4} )";
            string where_user_constraints = " where user_id in (select user_id from pharos_ADD_transactions where time_released >= '{2}' and time_released <= '{3}' and amount = {4} )";

            if (quota > 0) // if greater than zero, we need to add another paramter to check for certain users
            {
               
                if (sStartDate != "" && sEndDate != "")
                {
                    sql = sql + constraints + order + user_constraints;
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
                    sql = sql + constraints;
                    System.Diagnostics.Debug.WriteLine(sql);
                }
            }

            Dictionary<String, Object> json_dict = new Dictionary<string, Object>();

            Dictionary<String, dynamic> o = new Dictionary<string, dynamic>();
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
                        o["Key"] = "one_sided_count";
                        o["Value"] = int.Parse(reader["count"].ToString());
                    }
                }
                L.Add(o);
                   
                
            }


           

            sql = "select COUNT(*) as count from pharos_transactions ";
            constraints = " where charindex('Duplex', print_attributes) <> 0 ";
            order = " and time_released >= '{0}' and time_released <= '{1}'";

            if (quota > 0) // if greater than zero, we need to add another paramter to check for certain users
            {

                if (sStartDate != "" && sEndDate != "")
                {
                    sql = sql + constraints + order + user_constraints;
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
                    sql = sql + constraints;
                    System.Diagnostics.Debug.WriteLine(sql);
                }
            }
             //List<tran_info> L = new List<tran_info>();
            Dictionary<String, dynamic> d = new Dictionary<string, dynamic>();
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("", conn))
                {
                    cmd.CommandText = sql;
                    SqlDataReader reader = cmd.ExecuteReader();

                    while (reader.Read())
                    {
                        d["Key"] = "double_sided_count";
                        d["Value"] = int.Parse(reader["count"].ToString());
                        //d["double_sided_count"] = reader["count"].ToString();
                    }
                }
                L.Add(d);      
                
            }
            json_dict["Title"] = "Print Counts" ;
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