<?php

namespace App\Events;

use App\Entity\Client;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class ClientUserSubscriber implements EventSubscriberInterface
{
    /**
     * Undocumented variable
     *
     * @var Security
     */
    private $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['setUserForClient', EventPriorities::PRE_VALIDATE]
        ];
    }
    
    public function setUserForClient(ViewEvent $event)
    {
       $client = $event->getControllerResult();
       $method = $event->getRequest()->getMethod();
       
       if($client instanceof Client && $method === "POST")
       {
         //Recuper l'utilisateur actuellement connecté
          $user = $this->security->getUser();

         //Assigner l'utilisateur à ce client qu'on est en train de créer
         $client->setUser($user);
       }

       
       
    }

}