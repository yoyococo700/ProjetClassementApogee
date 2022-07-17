

class note:
    note:float=0
    ECTS:int=1
    matiere:str=""
    def __init__(self,_note,_ECTS,_matiere) -> note:
        self.note=_note
        self.ECTS=_ECTS
        self.matiere = _matiere
        return self 
    
    def print(self):
        print((self.matiere,self.note,self.ECTS))

class etudiant:
    numero_etudiant:str=""
    nom:str=""
    prenom:str=""
    liste_note:note=[] 
    
    def addNote(self,_note):
        self.liste_note.append(_note) 


