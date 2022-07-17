from tokenize import String
import tabula
import pandas 
from PyPDF2 import PdfReader
import etudiant


base:etudiant = []


def alreadyIn(base:etudiant,num_etu):
    for i in range(0,base.len()):
        if base[i].numero_etudiant == num_etu:
            return i
    return -1



def pickNote(text:str):
    #print(text[170:])
    espace = "              "
    nb = text.rfind(espace)
    if nb!=-1:
        selection = text[nb+len(espace):]
        nb = selection.find("\\r")
        print(selection[:nb])
        return selection[:nb]

def pickECTS(df):
    for i in df:
        j=0
        while (True):
            try:
                text=(i.loc[j][[1,2]].to_string())
                nb = text.rfind("ADM")
                if text[nb+6:nb+7]>"0" and text[nb+6:nb+7]<"9":
                    print(text[nb+6:nb+7])
                    return text[nb+6:nb+7]
            except:
                break
            else:
                j=j+1

    



def pickNumEtudiant(df):
    return(df[14:])

def pickUE(nomPdf:str):
    file = open(nomPdf,"rb")
    fileReader = PdfReader(file)
    page =fileReader.pages[1] 
    texte = page.extract_text()
    nb=texte.find("LU")
    print(texte[nb:nb+8])
    return texte[nb:nb+8]



def appendNoteToDb(df,UE:str):
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
                if not alreadyIn(base,num_etu):
                    base.append()
            except:
                print("break")
                break
            else:
                j=j+1


df = tabula.read_pdf("test1.pdf",lattice=True,pages = "all")


