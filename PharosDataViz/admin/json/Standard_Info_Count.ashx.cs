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
    /// Summary description for Standard_Info_Count
    /// 
    /// </summary>
    public class Standard_Info_Count : IHttpHandler
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




            string sql = "select sum(qty) as pages, sum (qty2) as sheets, count(distinct(transaction_id)) as transactions from pharos_S_transactions  ";
            string constraints = " where ";
            string order = "  time_released >= '{0}' and time_released <= '{1}'";
         

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
              
            }
            //where ReservationStatus <> 'Cancelled' and  StartDate>='{0}' and EndDate<='{1}'

            Dictionary<String, Object> json_dict = new Dictionary<string, Object>();

           
            List<Dictionary<String, dynamic>> L = new List<Dictionary<string, dynamic>>();
            //List<tran_info> L = new List<tran_info>();
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("", conn))
                {
                    cmd.CommandText = sql;
                    SqlDataReader reader = cmd.ExecuteReader();

                    while (reader.Read())
                    {
                        Dictionary<String, dynamic> o = new Dictionary<string, dynamic>();
                        o["Key"] = "transactions";
                        o["Value"] = int.Parse(reader["transactions"].ToString());
                        L.Add(o);

                        Dictionary<String, dynamic> p = new Dictionary<string, dynamic>();
                        p["Key"] = "Pages";
                        p["Value"] = int.Parse(reader["pages"].ToString());
                        L.Add(p);

                        Dictionary<String, dynamic> s = new Dictionary<string, dynamic>();
                        s["Key"] = "Sheets";
                        s["Value"] = int.Parse(reader["sheets"].ToString());
                        L.Add(s);
                        
                    }
                }
               
                
            }


           

            sql = "select count(distinct(user_id)) as user_count from pharos_ADD_transactions " ;
            where_user_constraints = " where time_released >= '{0}' and time_released <= '{1}' and amount = {2} ";

                if (usStartDate != "" && usEndDate != "")
                {
                    sql = sql + where_user_constraints;
                    sql = String.Format(sql, usStartDate, usEndDate, quota);
                    System.Diagnostics.Debug.WriteLine(sql);
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
                        d["Key"] = "Enrolled_Students";
                        d["Value"] = int.Parse(reader["user_count"].ToString());
                        //d["double_sided_count"] = reader["count"].ToString();
                    }
                }
                L.Add(d);      
                
            }


            json_dict["Title"] = "Semester General Info" ;
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