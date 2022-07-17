#include <stdio.h>

int powe(int x,int y){
  int somme = 1;
  for (int i = 0; i < y; i++)
  {
    somme*=x;
  }
  return somme;
};

int studentIdToInt(char id[8]){
  int res =0 ;
  int temp;
  for(int i=0; i<8; i++){
    temp = id[i]-'0';
    res+= temp * powe(10,7-i);
  };
  return res;
}

void JSONreturn(int taille,int nb_elevesUE[],int classement_UE[]){
  printf("[");
  for (int i = 0; i < taille; i++) {
    if (!classement_UE[i + 1] == 0 || !nb_elevesUE[i + 1] == 0 ){
      printf("{\"UE\":\"LU2MEOO%d\",\"classement\":\"%d\",\"total\":\"%d\"}", i + 1, classement_UE[i + 1],nb_elevesUE[i + 1]);
      if (i!= taille -1)
        printf(",");
    }
    else
      i++;
  }
  printf("]\n");
}

int main(int argc, char *argv[]) {

  int nb, nbUE, nbint;
  int n = 0;
  float note, noteint;
  char UE[8];
  int classement_UE[10], nb_elevesUE[10];
  int eleve = studentIdToInt(argv[1]);
  FILE *open = fopen("output2.csv", "r");
  while (fscanf(open, "%c%c%c%c%c%d;%d;%f\n", &UE[0], &UE[1], &UE[2], &UE[3], &UE[4], &nbUE, &nb, &note) != EOF) {
    if (nb == eleve) {
      n = n + 1;
      classement_UE[nbUE] = 1;
      nbint = nbUE;
      noteint = note;
      nb_elevesUE[nbint] = 0;
      FILE *open2 = fopen("output.csv", "r");
      while (fscanf(open2, "%c%c%c%c%c%d;%d;%f\n", &UE[0], &UE[1], &UE[2], &UE[3], &UE[4], &nbUE, &nb, &note) != EOF) {
        if (nbUE == nbint) {
          nb_elevesUE[nbint] += 1;
          if (note > noteint) {
            classement_UE[nbint] += 1;
          }
        }
      }
      fclose(open2);
    }
  }
  fclose(open);
  JSONreturn(n,nb_elevesUE,classement_UE);
  return 0;
}