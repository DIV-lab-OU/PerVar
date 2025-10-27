#include <stdio.h>
#include <stdlib.h>

int main ()
{ /* main */

 /**********************************************************
  *declaration subsection, item codes**********************/

   int meal_select_code;
   const int lunch_code                                =1;
   const int dinner_code                               =2;
   
   int app_item_code;
   const int app_no_app_code                           =0;
   const int app_chicken_code                          =1;
   const int app_pot_stickers_code                     =2;
   const int app_spring_roll_code                      =3;
   
   int ent_item_code;
   const int ent_no_ent_code                           =0;
   const int ent_beef_code                             =1;
   const int ent_curry_code                            =2;
   const int ent_tofu_code                             =3;
   
   int side_item_code;
   const int side_none_code                            =0;
   const int side_fried_rice_code                      =1;
   const int side_steamed_rice_code                    =2;
   const int side_noodles_code                         =3;

   int drink_item_code;
   const int drink_none_code                           =0;
   const int drink_coffee_code                         =1;
   const int drink_tea_code                            =2;
   const int drink_soda_code                           =3;
   
/**********************************************************
 *declaration subsection, item prices*********************/
 
  float app_value;
  const float app_no_app_value                         =0;
  const float app_chicken_value                        =6.00;
  const float app_pot_stickers_value                   =5.75;
  const float app_spring_roll_value                    =4.25;
  
  float ent_value;
  const float ent_no_ent_value                         =0;
  const float ent_beef_lunch_value                     =12.75;
  const float ent_beef_dinner_value                    =14.25;
  const float ent_curry_lunch_value                    =10.00;
  const float ent_curry_dinner_value                   =13.50;
  const float ent_tofu_lunch_value                     =9.25;
  const float ent_tofu_dinner_value                    =12.75;
 
  float side_item_value;
  const int side_none_value                            =0;
  const int side_fried_rice_value                      =0;
  const int side_steamed_rice_value                    =0;
  const int side_noodles_value                         =0;
 
  float drink_value;
  const float drink_none_value                         =0;
  const float drink_coffee_value                       =4.75;
  const float drink_tea_value                          =3.00;
  const float drink_soda_value                         =2.25;

/**********************************************************
 *declaration subsection, tax, tips, total****************/

 const float tip_amount_percentage                     =.20;
 const float tax                                       =.0875;
 float total_pre_tax_and_tip;
 float grand_total;
 const int program_failure_code                        =-1;

/*********************************************************
 *greeting subsection************************************/

    printf("Welcome to Skyler's Asian Fusion!\n");
    printf("I'm a digital assistant designed to help you order \n");
    printf("Please follow the prompts to order your meal\n");
    printf("Are you having lunch or dinner?\n");
    printf("Please press 1 for lunch or 2 for dinner\n");
    scanf(" %d \n", &meal_select_code);
   
    printf("Excellent, please select an appetizer\n");
    printf("Press 0 for no appetizer\n");
    printf("Press 1 for the chicked satay\n");
    printf("Press 2 for the pot stickers\n");
    printf("Press 3 for the spring rolls\n");
    scanf(" %d \n", & app_item_code);

    printf("Great choice, please select an entree\n");
    printf("Press 0 for no entree\n");
    printf("Press 1 for the beef pho\n");
    printf("Press 2 for the red curry chicken\n");
    printf("Press 3 for the kung pao tofu\n");
    scanf(" %d \n", &ent_item_code);

    printf("Please select a side (it's free!)\n");
    printf("Press 0 for no side\n");
    printf("Press 1 for fried rice\n");
    printf("Press 2 for steamed rice\n");
    printf("Press 3 for noodles\n");
    scanf(" %d \n", &side_item_code);

    printf("Finally, please select a drink\n");
    printf("Press 0 for no drink\n");
    printf("Press 1 for coffee\n");
    printf("Press 2 for tea\n");
    printf("Press 3 for soda\n");
    scanf(" %d \n", &drink_item_code);

/***********************************************************************
*output subsection*****************************************************/
   
    printf("---------------------------------------\n");
    printf("------Skyler's Asian Fusion Bill-------\n");
    printf("---------------------------------------\n");
    printf(" %f                                   $5.2f\n",
    app_value); 
   
/***********************************************************************
*calculation subsection***********************************************/

    if (app_item_code == app_no_app_code) {
        app_value = app_no_app_value;
    } /* if app_item_value == no_app_value) */
    else if (app_item_code == app_chicken_code) {
        app_value = app_chicken_value;
    } /* if app_item_code == app_chicken_code */
    else if (app_item_code == app_pot_stickers_code) {
        app_value = app_pot_stickers_value;
    } /* if app_item_code == app_pot_stickers_value */
    else if (app_item_code == app_spring_roll_code) {
        app_value = app_spring_roll_value;
    } /* if app_item_code == app_spring_rolls_value */
 
    if ((app_item_code != app_no_app_code)        &&
        (app_item_code != app_chicken_code)       &&
        (app_item_code != app_pot_stickers_code)  &&
        (app_item_code != app_spring_roll_code)) {
        printf("ERROR: unknown appitizer code %d. \n",
            app_item_code);
        exit (program_failure_code);
    }
  

    if (side_item_code == side_none_code) {
        side_item_value = side_none_value;
    } /* if side_item_value == side_none_value */
    else if (side_item_code == side_fried_rice_code) {
             side_item_value = side_fried_rice_value;
    } /* if side_item_value == side_fried_rice_value */
    else if (side_item_code == side_steamed_rice_code) {
             side_item_value = side_steamed_rice_value;
    } /* if side_item_value == side_steamed_rice_value */
    else if (side_item_code == side_noodles_code) {
             side_item_value = side_noodles_value;
    } /* if side_item_value == side_noodles_value */

    if (drink_item_code == drink_none_code) {
        drink_value = drink_none_value;
    } /* if drink_item_value == drink_none_value */
    else if (drink_item_code == drink_coffee_code) {
             drink_value = drink_coffee_value;
    } /* if drink_item_value == drink_coffee_value */
    else if (drink_item_code == drink_tea_code)  {
             drink_value = drink_tea_value;
    } /* if drink_item_value == drink_tea_value */
    else if (drink_item_code == drink_soda_code) {
             drink_value = drink_soda_value;
    } /* if drink_item_value == drink_soda_value */  


} /* main */

