<?php

namespace App\Events;

use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Facture;
use App\Repository\FactureRepository;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class FactureChronoSubscriber implements EventSubscriberInterface
{
     /**
      * @var Security
      */
     private $security;
     
     /**
      * @var FactureRepository
      */
     private $repo;

     public function __construct(Security $security, FactureRepository $repo)
     {
         $this->security = $security;
         $this->repo = $repo;
     }

     public static function getSubscribedEvents()
     {
         return [
             KernelEvents::VIEW => ['setChronoFacture', EventPriorities::PRE_VALIDATE]
         ];
     }

     public function setChronoFacture(ViewEvent $event)
     {
        $facture = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();
        
        if($facture instanceof Facture && $method === "POST")
        {     
            $nextChrono = $this->repo->findNextChrono($this->security->getUser());
            $facture->setChrono($nextChrono++);   


            //Mettre la date de la facture automatiquement
            if(empty($facture->getSentAt()))
            {
                $facture->setSentAt(new \DateTime());
            }
                     
        }
        
     }
}