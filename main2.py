import tabula
import pandas 
from PyPDF2 import PdfReader
import os
import etudiant

import sqlite3
con = sqlite3.connect('Students.db')
cur = con.cursor()



def clearNoteData(cur):
    cur.execute("DROP TABLE IF EXISTS jury")

def createTableJury(cur):
    cur.execute("CREATE TABLE IF NOT EXISTS jury(UE, numero_etudiant NOT NULL , session1 ,session2,ECTS)")

def clearEtuData(cur):
    cur.execute("DELETE FROM etudiant WHERE TRUE")



def pickUE(nomPdf:str):
    file = open(nomPdf,"rb")
    fileReader = PdfReader(file)
    page =fileReader.pages[1] 
    texte = page.extract_text()
    nb=texte.find("LU")
    #print(texte[nb:nb+8])
    return texte[nb:nb+8]

def pickECTS(df):
    for i in df:
        j=0
        while (True):
            try:
                text=(i.loc[j][[1,2]].to_string())
                nb = text.rfind("ADM")
                if text[nb+6:nb+7]>"0" and text[nb+6:nb+7]<="9":
                    print(text[nb+6:nb+7])
                    return text[nb+6:nb+7]
            except:
                break
            else:
                j=j+1



def pickNote(text:str):
    espace = "              "
    nb = text.rfind(espace)
    if nb!=-1:
        selection = text[nb+len(espace):]
        nb = selection.find("\\r")
        #print(selection[:nb])
        return selection[:nb]

def pickNumEtudiant(df):
    #print(df[14:])
    return(df[14:])


def getNumEtudiant(dictionnaire:dict):
    liste = []
    for i in dictionnaire.get('Identification des étudiants'):
        #print(dictionnaire.get('Identification des étudiants')[i][14:])
        liste.append( (dictionnaire.get('Identification des étudiants')[i][14:], ' ', ' ') )
    return liste

def appendNumEtuToDb(df,cur):
    sql = "INSERT OR REPLACE INTO etudiant(numero_etudiant,nom,prenom) VALUES(?, ?, ?)"
    for i in df:
        dict = i.to_dict()
        cur.executemany(sql,getNumEtudiant(dict))

def appendNoteToDb(df,cur,UE:str):
    sql = "INSERT OR REPLACE INTO jury(UE,numero_etudiant,session1,session2,ECTS) VALUES(?, ?, ?, ?, ?)"
    liste = []
    liste_etu = []
    ECTS = pickECTS(df)
    for i in df:
        j=0
        liste.clear()
        while (True):
            try:
                text=(i.loc[j][[1,2]].to_string())
                num_etu = pickNumEtudiant(i.loc[j][0])
                note = pickNote(text)
                liste.append((UE,num_etu,note," ",ECTS))

            except:
                print("break")
                break
            else:
                j=j+1
        #print(liste)
        cur.executemany(sql,liste)




clearNoteData(cur)
createTableJury(cur)
clearEtuData(cur)

listedir = os.listdir("resultatsS2")
for i in listedir:   
    nom_pdf = "resultatsS2/%s"%i
    df = tabula.read_pdf(nom_pdf,lattice=True,pages = "all")
    UE = pickUE(nom_pdf)
    appendNoteToDb(df,cur,UE)
    appendNumEtuToDb(df,cur)

listedir = os.listdir("resultatsS1")
for i in listedir:   
    nom_pdf = "resultatsS1/%s"%i
    #print(nom_pdf)
    df = tabula.read_pdf(nom_pdf,lattice=True,pages = "all")
    UE = pickUE(nom_pdf)
    appendNoteToDb(df,cur,UE)
    appendNumEtuToDb(df,cur)


con.commit()
con.close()
