<?php

namespace App\Events;

use Symfony\Component\HttpFoundation\RequestStack;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JwtCreatedSubscriber
{
    /**
     * Undocumented variable
     *
     * @var RequestStack
     */
    private $requestStack;

    public function __construct(RequestStack $requestStack)
    {
        $this->requestStack = $requestStack;
    }
    
    /**
     *
     * @param JWTCreatedEvent $event
     * @return void
     */
    public function updateJwtData(JWTCreatedEvent $event)
    {
        $request = $this->requestStack->getCurrentRequest();
        //Recuperer un utilisateur afin d'obtenir son firstname et son lastname
        $user = $event->getUser();
        //Enrichir les data afin qu'elles puiise contenir ces données
        $data = $event->getData();
        $data['firstname'] = $user->getFirstname();
        $data['lastname'] = $user->getLastname();
        $event->setData($data);
        //dd($data);
    }
}