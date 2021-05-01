<?php

namespace App\DataFixtures;

use App\Entity\Client;
use App\Entity\Facture;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AppFixtures extends Fixture
{
   /**
    * Encodeur de mot de passe
    *
    * @var UserPasswordEncoderInterface
    */
   private $encoder;

   public function __construct(UserPasswordEncoderInterface  $encoder)
   {
       $this->encoder = $encoder;
   }

    public function load(ObjectManager $manager)
    {
        $faker = Factory::create('fr_FR');
        
        for($j=0; $j<10; $j++){
            $user = new User();
            $chrono = 1;
            $hash = $this->encoder->encodePassword($user, "password");

            $user->setFirstname($faker->firstName())
                 ->setLastname($faker->lastName)
                 ->setEmail($faker->email)
                 ->setPassword($hash);
             $manager->persist($user);   


             for($c=0; $c<mt_rand(5, 20); $c++){
                $client = new Client();
                $client->setPrenom($faker->firstName())
                       ->setNom($faker->lastName)
                       ->setEmail($faker->email)
                       ->setCompany($faker->company)
                       ->setUser($user);
                $manager->persist($client);
                
                for($i=0; $i<mt_rand(5, 15); $i++){
                    $facture = new Facture();
                    $facture->setMontant($faker->randomFloat(2, 300, 10000))
                            ->setSentAt($faker->dateTimeBetween('-6 months'))
                            ->setStatut($faker->randomElement(['ENVOYE', 'PAYE', 'ANNULE']))
                            ->setChrono($chrono)
                            ->setClient($client);
    
                    $chrono++;
                    $manager->persist($facture);
                    
                }
            }
        }
        
        
        // $product = new Product();
        // $manager->persist($product);

        $manager->flush();
    }
}

