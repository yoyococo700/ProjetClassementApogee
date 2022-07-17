from tokenize import String
import tabula
import pandas 

# import sqlite3
# con = sqlite3.connect('Students.db')
# cur = con.cursor()

def pickNote(text:str):
    #print(text[170:])
    espace = "              "
    nb = text.rfind(espace)
    if nb!=-1:
        selection = text[nb+len(espace):]
        nb = selection.find("\\r")
        print(selection[:nb])
        return selection[:nb]

def pickNumEtudiant(df):
    return(df[14:])


# def getNumEtudiant(dictionnaire:dict):
#     liste = []
#     for i in dictionnaire.get('Identification des étudiants'):
#         #print(dictionnaire.get('Identification des étudiants')[i][14:])
#         liste.append( (dictionnaire.get('Identification des étudiants')[i][14:], ' ', ' ') )
#     return liste

# def appendNumEtuToDb(df,cur):
#     sql = "INSERT INTO etudiant(numero_etudiant,nom,prenom) VALUES(?, ?, ?)"
#     for i in df:
#         dict = i.to_dict()
#         cur.executemany(sql,getNumEtudiant(dict))

for k in range (1,2):
    df = tabula.read_pdf("resultats/%s.pdf" %k,lattice=True,pages = "all")
    print("###########################################################################")
    for i in df:
        j=0
        while (True):
            try:
                text=(i.loc[j][[1,2]].to_string())
                pickNumEtudiant(i.loc[j][0])
                pickNote(text)
                
                print("------------------------")
            except:
                break
            else:
                j=j+1
