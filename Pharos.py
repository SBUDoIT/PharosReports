import pymssql
import getpass
from datetime import datetime
from decimal import *

# server and db_name for all sql queries defined at end of file

###################################################
# ALL THE DATABASE GOODNESS FOR THE WEB APP :D # 
###################################################
# print and saving queries
###################################################
# print the query so we know qhat is happending in what
def printquery(query):
	cursor.execute(query)
	row = cursor.fetchone()
	while row:
		s = "  "
		for i in row:
			s += str(i) + ", "    # nonascii characters like Diaz (where i is accented) accented things... break at this line
		s = s[2:-2] 
		print (s)
		row = cursor.fetchone()
	

# save query 
def saveOquery(query, cursor):
	cursor.execute(query)
	row = cursor.fetchone()
	array = []
	while row:
		for r in row:
			if type(r) is not int and type(r) is not datetime and type(r) is not Decimal and r is not None:
				r = r.encode('utf8') # latin-1
		array.append(row)
		row = cursor.fetchone()
	return array





#########################################################################
#       PHAROS USERS DATABASE 
#########################################################################
def builduserDB(server, db_name, dbname, table_name):
	x = 0
	try:
		conn = pymssql.connect(
			server, 
			database = db_name
			)

		cursor = conn.cursor()

		print ("saving users from old user db")
		query = """	
	select u.user_id, u.id , u.user_alias ,  gr.id as 'group', ro.name as 'role', u.active, u.billing_option, u.first_names, u.last_name, u.card_id, u.email,u.created 
		from users u
		INNER JOIN groups gr on u.group_id = gr.group_id
		INNER JOIN role ro on u.role_id = ro.role_id

			"""

		x = saveOquery(query, cursor)
		

		conn.close()

	except Exception as e:
		print(e)
		exit(0)


	# STORE IN LOCAL DATABASE
	print ("Storing users into local db")
	server = "RICH-INTERN1-PC"
	try:
		conn = pymssql.connect(
			server, 
			database=dbname
			)

		cursor = conn.cursor()

	# timestamp versus date versus tim for created
		query = """
			IF OBJECT_ID('{0}', 'U') IS NOT NULL
				DROP TABLE {0}
			CREATE TABLE {0} (
				user_id VARCHAR(100),
				netid VARCHAR(100),
				netid_alias VARCHAR(100), 
				group_type VARCHAR(100),
				role_type VARCHAR(100),
				active tinyint NOT NULL, 
				billing_option VARCHAR(100),
				first_names VARCHAR(100),
				last_name VARCHAR(100),
				card_id nvarchar(255), 
				email VARCHAR(100),
				created datetime
				)  
			""".format(table_name)
		
		cursor.execute(query)
	   	conn.commit()
	   	
	   	cursor.executemany(
	   		"INSERT INTO {0} VALUES (%s, %s, %s, %s, %s, %d, %s, %s, %s, %d,%s, %s )".format(table_name),
	   		x
	   		)
		
		conn.commit()	

		conn.close()
		print "Finished moving to new db table: " + table_name
		print datetime.now()
		print
	except Exception as e:
		print(e)
		exit(0)


#########################################################################
#       PHAROS TRANSACTIONS DATABASE 
#########################################################################

def buildADDtransactions(server, db_name,dbname,table_name,string_date):
	x = 0

	try:
		conn = pymssql.connect(
			server, 
			database = db_name,
			charset="ISO-8859-1"
			)

		cursor = conn.cursor()

		# there are some u.id that may not actually be u.id.. though should we include alias? 
		print "start of reading the old transaction database"

		query = """
		Declare @0 datetime
		set @0 = '{0}'
		SELECT DISTINCT(trans.transaction_id), trans.user_id as user_id, u.id as 'netid', u.first_names, u.last_name, trans.time as time_released, 
 			trans.amount, trans.qty, trans.qty2
		FROM transactions trans 
			INNER JOIN users u on trans.user_id = u.user_id
			
			where trans.time >= @0 and amount > 0
				ORDER BY trans.time DESC
		""".format(string_date)

		print "saving and running query right now"
		x = saveOquery(query, cursor)
		conn.close()
		
	except Exception as e:
		print(e)
		exit(0)

	print "reading old db done: "
	print datetime.now()
	print "moving to local db, prepare for stampede of data...."
	print datetime.now()
	print "moving to " + dbname
	# STORE IN LOCAL DATABASE

	server = "RICH-INTERN1-PC"
	try:
		conn = pymssql.connect(
			server, 
			database=dbname
			)

		cursor = conn.cursor()
		
		

	# timestamp versus date versus tim for created
		query = """
			IF OBJECT_ID('{0}', 'U') IS NOT NULL
				DROP TABLE {0}
			CREATE TABLE {0} (
				transaction_id INT NOT NULL,
				user_id INT NOT NULL,
				netid NVARCHAR(255),
				first_names NVARCHAR(50),
				last_name NVARCHAR(30),
				time_released DATETIME NOT NULL, 
				amount MONEY NOT NULL,
				qty INT, 
				qty2 INT,
				
				)  
			""".format(table_name)

		#created timestamp
		cursor.execute(query)
		conn.commit()
	   
	   	cursor.executemany(
	   		#"INSERT INTO {0} VALUES (%d, %d, %s, %s, %s, %s, %s, %s, %d, %d, %s, %s, %s,%s, %s, %s, %s, %s, %s)".format('pharos_transactions'),
	   		"INSERT INTO {0} VALUES (%d, %d, %s, %s, %s, %s, %s, %d, %d)".format(table_name),
	   		x
	   		)
		
		conn.commit()	

		conn.close()

		print "finished building local db: " + table_name+ " with transactions"
		print datetime.now() 
		print "closing local db connection"
		print 
	except Exception as e:
		print(e)
		exit(0)

def buildtransactions(server, db_name, dbname,table_name,string_date):
	x = 0

	try:
		conn = pymssql.connect(
			server, 
			database = db_name,
			charset="ISO-8859-1"
			)

		cursor = conn.cursor()

		# there are some u.id that may not actually be u.id.. though should we include alias? 
		print "start of reading the old transaction database"

		query = """
		Declare @0 datetime
		set @0 = '{0}'
		SELECT DISTINCT(trans.transaction_id), trans.user_id as user_id, u.id as 'netid', u.first_names, u.last_name, trans.time as time_released, 
		ptran.job_name, trans.amount, trans.qty, trans.qty2, 
		--ps.description as location_description_temp,  
		devs.device,
		--res.name as PharosOmega_NAME, 
		ttype.type as transaction_type,  ttype.name as transaction_type_desc, 
		--pa.print_attributes, pa.display_attributes, 
		ja.name,
		ptran.print_group
		FROM 
			transactions trans 
			INNER JOIN users u on trans.user_id = u.user_id
			
			INNER JOIN print_transactions ptran on  trans.transaction_id = ptran.transaction_id
			INNER JOIN transaction_types ttype on trans.ttype_id = ttype.ttype_id
			INNER JOIN transaction_print_attributes tpa on trans.transaction_id = tpa.transaction_id
			INNER JOIN print_attributes pa on tpa.print_attributes_id = pa.print_attributes_id 
			INNER JOIN job_attributes ja on pa.paper_size_id = ja.jattr_id
			INNER JOIN devices devs on devs.device_id = trans.ref_id
			where trans.time >= @0
				ORDER BY trans.time DESC
		""".format(string_date)
		print "saving and running query right now"
		x = saveOquery(query, cursor)
		conn.close()
		
	except Exception as e:
		print(e)
		exit(0)

	print "reading old db done: "
	print datetime.now()
	print "moving to local db, prepare for stampede of data...."
	print datetime.now()
	print "moving to " + dbname + ", " + table_name 
	# STORE IN LOCAL DATABASE

	server = "RICH-INTERN1-PC"
	try:
		conn = pymssql.connect(
			server, 
			database=dbname
			)

		cursor = conn.cursor()
		
		query = """
			IF OBJECT_ID('{0}', 'U') IS NOT NULL
				DROP TABLE {0}
			CREATE TABLE {0} (
				transaction_id INT NOT NULL,
				user_id INT NOT NULL,
				netid NVARCHAR(255),
				first_names NVARCHAR(50),
				last_name NVARCHAR(30),
				time_released DATETIME , 
				job_name NVARCHAR(128),
				amount MONEY ,
				qty INT, 
				qty2 INT,
				--location_description VARCHAR(100),
				device_name nvarchar(32) ,
				--resource_name nvarchar(32) ,
				transaction_type NVARCHAR(2) ,
				transaction_typename NVARCHAR(32),
				print_attributes NVARCHAR(255) ,
				display_attributes NVARCHAR(255) ,
				paper_size NVARCHAR(64) ,
				print_group NVARCHAR(64)
				)  
			""".format(table_name)
		#created timestamp
		cursor.execute(query)
		conn.commit()
	   
	   	cursor.executemany(
	   		#"INSERT INTO {0} VALUES (%d, %d, %s, %s, %s, %s, %s, %s, %d, %d, %s, %s, %s,%s, %s, %s, %s, %s, %s)".format('pharos_transactions'),
	   		"INSERT INTO {0} VALUES (%d, %d, %s, %s, %s, %s, %s, %s, %d, %d, %s,%s, %s, %s, %s, %s, %s)".format(table_name),
	   		x
	   		)
		
		conn.commit()	

		conn.close()

		print "finished building local db: " + table_name+ " with transactions"
		print datetime.now() 
		print "closing local db connection"
		print
	except Exception as e:
		print(e)
		exit(0)



def buildtransactionsNOPrintDisplayAttributes(server, db_name,dbname, table_name, string_date):
	x = 0

	try:
		conn = pymssql.connect(
			server, 
			database = db_name,
			charset="ISO-8859-1"
			)

		cursor = conn.cursor()

		# there are some u.id that may not actually be u.id.. though should we include alias? 
		print "start of reading the old transaction database"
	
		query = """
		Declare @0 datetime
		set @0 = '{0}'
		SELECT DISTINCT(trans.transaction_id), trans.user_id as user_id, u.id as 'netid', u.first_names, u.last_name, trans.time as time_released, 
		ptran.job_name, trans.amount, trans.qty, trans.qty2, 
		--ps.description as location_description_temp,  
		devs.device,
		--res.name as PharosOmega_NAME, 
		ttype.type as transaction_type,  ttype.name as transaction_type_desc, 
		--pa.print_attributes, pa.display_attributes, 
		ja.name,
		ptran.print_group
		FROM 
			transactions trans 
			INNER JOIN users u on trans.user_id = u.user_id
			
			INNER JOIN print_transactions ptran on  trans.transaction_id = ptran.transaction_id
			INNER JOIN transaction_types ttype on trans.ttype_id = ttype.ttype_id
			INNER JOIN transaction_print_attributes tpa on trans.transaction_id = tpa.transaction_id

			INNER JOIN print_attributes pa on tpa.print_attributes_id = pa.print_attributes_id 
			INNER JOIN job_attributes ja on pa.paper_size_id = ja.jattr_id

			INNER JOIN devices devs on devs.device_id = trans.ref_id
			where trans.time >= @0
				ORDER BY trans.time DESC
		""".format(string_date)

		print "saving and running query right now"
		x = saveOquery(query, cursor)
		conn.close()
		
	except Exception as e:
		print(e)
		exit(0)

	print "reading old db done: "
	print datetime.now()
	print "moving to local db, prepare for stampede of data...."
	print "moving to " + dbname + " "  + table_name
	# STORE IN LOCAL DATABASE

	server = "RICH-INTERN1-PC"
	try:
		conn = pymssql.connect(
			server, 
			database=dbname
						)

		cursor = conn.cursor()
		
		

	# timestamp versus date versus tim for created
		query = """
			IF OBJECT_ID('{0}', 'U') IS NOT NULL
				DROP TABLE {0}
			CREATE TABLE {0} (
				transaction_id INT NOT NULL,
				user_id INT NOT NULL,
				netid NVARCHAR(255),
				first_names NVARCHAR(50),
				last_name NVARCHAR(30),
				time_released DATETIME NOT NULL, 
				job_name NVARCHAR(128),
				amount MONEY NOT NULL,
				qty INT, 
				qty2 INT,
				--location_description VARCHAR(100),
				device_name nvarchar(32) NOT NULL,
				--resource_name nvarchar(32) NOT NULL,
				transaction_type NVARCHAR(2) NOT NULL,
				transaction_typename NVARCHAR(32) NOT NULL,
				------print_attributes NVARCHAR(255) NOT NULL,
				------display_attributes NVARCHAR(255) NOT NULL,
				paper_size NVARCHAR(64) NOT NULL,
				print_group NVARCHAR(64)
				)  
			""".format(table_name)


		query = """
			IF OBJECT_ID('{0}', 'U') IS NOT NULL
				DROP TABLE {0}
			CREATE TABLE {0} (
				transaction_id INT NOT NULL,
				user_id INT NOT NULL,
				netid NVARCHAR(255),
				first_names NVARCHAR(50),
				last_name NVARCHAR(30),
				time_released DATETIME , 
				job_name NVARCHAR(128),
				amount MONEY ,
				qty INT, 
				qty2 INT,
				--location_description VARCHAR(100),
				device_name nvarchar(32) ,
				--resource_name nvarchar(32) ,
				transaction_type NVARCHAR(2) ,
				transaction_typename NVARCHAR(32),
				------print_attributes NVARCHAR(255) ,
				------display_attributes NVARCHAR(255) ,
				paper_size NVARCHAR(64) ,
				print_group NVARCHAR(64)
				)  
			""".format(table_name)
		#created timestamp
		cursor.execute(query)
		conn.commit()
	   
	   	cursor.executemany(
	   		#"INSERT INTO {0} VALUES (%d, %d, %s, %s, %s, %s, %s, %s, %d, %d, %s, %s, %s,%s, %s, %s, %s, %s, %s)".format('pharos_transactions'),
	   		"INSERT INTO {0} VALUES (%d, %d, %s, %s, %s, %s, %s, %s, %d, %d, %s,%s,  %s, %s, %s)".format(table_name),
	   		x
	   		)
		
		conn.commit()	

		conn.close()

		print "finished building local db: " + table_name+ " with transactions"
		print datetime.now() 
		print "closing local db connection"
		print 
	except Exception as e:
		print(e)
		exit(0)

#


server = "sql-listener1.campus.stonybrook.edu"
db_name = "DoIT.Web.TLT.PharosReporting-PROD"
dbname = "PharosDataSample"
########################################################################################################################################################################################
############### CHANGE DATE TO SUIT WHAT RANGE TABLES ARE FORMULATED... should be the EARLIEST DATE ##################
string_date = "8/10/2015"
########################################################################################################################################################################################

builduserDB(server, db_name,dbname, "pharos_users")
buildADDtransactions(server, db_name,dbname, "pharos_ADD_transactions", string_date)
buildtransactionsNOPrintDisplayAttributes(server, db_name,dbname, "pharos_S_transactions", string_date)


#buildtransactions()  <- this double counts transaction id's dont use