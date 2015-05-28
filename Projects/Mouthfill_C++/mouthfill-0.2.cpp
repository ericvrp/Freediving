//mouthfill.cpp by Christopher Henrich (c) 2014 cdh79@gmx.net v0.2
//This program calculates the maximum depth for apnea-divers to perform equalization after taking a mouthfill at a certain depth
#include <iostream>  //allows program to perform input and output
using namespace std; //allows using stds

//function main begins program execution
int main ()
{
   //variable declarations
   double compressionratio = 0; // depth that can be reached with a mouthfill from surface (initialized to 0)
   double rvdepth = 0; // depth at which mouthfill is done (initialized to 0)
   double maxdepth = 0; // maximum depth possible with mouthfill calculated from compressiondepth and rvdepth (initialized to 0)

   cout << "\nWelcome to Christopher Henrich's (cdh79@gmx.net) Mouthfill Calculator v0.2 (c) 2014\n\n" ; //introduction

   cout << "Please enter the depth that you can reach with a mouthfill from the surface (in meters): "; //prompt for user data
   cin >> compressionratio; // read input from user to compressionratio

   cout << "\nPlease enter the depth at which you take the mouthfill (in meters): "; // prompt user for data
   cin >> rvdepth; // read input from user to rvdepth

   maxdepth = ((( compressionratio / 10  + 1 ) * ( rvdepth / 10  + 1 ) ) - 1 ) * 10; // calculates the depth
 
   cout << "\nYour maximum equalization depth on a single mouthfill is " << maxdepth << " meters.\n\nBye Bye, Dive safely! \n" << std::endl; //displays depth; end line

} // end function main
