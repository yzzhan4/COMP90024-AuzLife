import pandas as pd
import json
import couchdbConnection as cC

def readJson(filename):
    return pd.read_csv(filename)  # read data from csv file download from aurin


def createDocs(csv_data):
    columns = csv_data.columns.values
    colNum = len(columns)
    docs = []
    for r in csv_data.values:
        i = 0
        doc = {}
        for col in columns:
            #t =  "\""+str(col)+"\"" +":" + "\""+str(r[i])+"\""
            doc[str(col)] = r[i]
            i += 1 
        docs.append(doc)
    return docs


def main():

    path = "E:/Unimelb/2020semester1/COPM90024 Cluster and Cloud Computing/assignment2/data/"
    filenameIncome = path + "Median income and age.csv"
    filenameAge = path + "age.csv"
    filenameEdu = path + "education.csv"

    csv_Income = readJson(filenameIncome)
    csv_Age = readJson(filenameAge)
    csv_Edu = readJson(filenameEdu)

    docsIncome = createDocs(csv_Income)
    docsAge = createDocs(csv_Age)
    docsEdu = createDocs(csv_Edu)


    #connect to couchdb
    user = "admin"
    password = "90024"
    #address = "127.0.0.1:5984"
    masterInstance = "172.26.131.147:5984"
    #couchserver = cC.authenticatedConnection(user,password,address)
    couchserver = cC.authenticatedConnection(user,password,masterInstance)
    
    #select database
    dbNameIncome = "aurin_income"
    dbNameAge = "aurin_age"
    dbNameEdu = "aurin_edu"
    dbIncome = cC.selectDatabase(dbNameIncome,couchserver)
    dbAge = cC.selectDatabase(dbNameAge,couchserver)
    dbEdu = cC.selectDatabase(dbNameEdu,couchserver)

    #update data into couchdb
    cC.updateDocs(dbIncome,docsIncome)
    cC.updateDocs(dbAge,docsAge)
    cC.updateDocs(dbEdu,docsEdu)

    #create views
    cC.ViewsIncome(dbIncome)
    cC.ViewsAge(dbAge)
    cC.ViewsEdu(dbEdu)

if __name__ == '__main__':
    try:
        main()

    except KeyboardInterrupt:
        sys.stderr.write("User interrupt me! ;-) Bye!\n")
        sys.exit(0)


