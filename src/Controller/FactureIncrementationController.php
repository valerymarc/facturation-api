<?php

namespace App\Controller;

use App\Entity\Facture;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Routing\Annotation\Route;

class FactureIncrementationController
{
    /**
     * 
     * @var EntityManagerInterface
     */
    private $manager;


    public function __construct(EntityManagerInterface $manager)
    {
        $this->manager = $manager;
    }
    
    public function __invoke(Facture $data)
    {
        $data->setChrono($data->getChrono()+1);
        $this->manager->flush();
        //dd($data);
        return $data;
    }

}