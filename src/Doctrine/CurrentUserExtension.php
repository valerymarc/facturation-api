<?php

namespace App\Doctrine;

use Doctrine\ORM\QueryBuilder;
use Symfony\Component\Security\Core\Security;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use App\Entity\Client;
use App\Entity\Facture;
use App\Entity\User;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

class CurrentUserExtension implements QueryCollectionExtensionInterface, QueryItemExtensionInterface
{
   /**
    * @var Security
    */
   private $security;

   /**
    * @var AuthorizationCheckerInterface
    */
   private $auth;

   public function __construct(Security $security, AuthorizationCheckerInterface $checker)
   {
      $this->security = $security;
      $this->auth = $checker;
   }
   
   private function getRessourceUser(QueryBuilder $queryBuilder, String $resourceClass)
   {
       //Recuperer l'utilisateur connecté
       $currentUser = $this->security->getUser();
       //S'il y a une demande de fcture et de client, alors etablir la requete DQL de facon à ce qu'elle fournisse 
       //uniquement les informations de l'utilisateur connecté

       //vreifier si le paramètre $resourceClass est un client ou une facture
       if(($resourceClass === Client::class || $resourceClass === Facture::class) 
       && !$this->auth->isGranted('ROLE_ADMIN') && $currentUser instanceof User)
       {
         $rootAlias = $queryBuilder->getRootAliases()[0];

         if($resourceClass === Client::class)
         {
            $queryBuilder->andWhere("$rootAlias.user = :user");
         }else if($resourceClass === Facture::class)
         {
            $queryBuilder->join("$rootAlias.client", "c")
                         ->andWhere("c.user = :user");
         }
         $queryBuilder->setParameter("user", $currentUser);
         //dd($queryBuilder);
       }
   }


   public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, ?string $operationName = null)
   {
       $this->getRessourceUser($queryBuilder, $resourceClass);
   }

   public function applyToItem(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, array $identifiers, ?string $operationName = null, array $context = [])
   {
      $this->getRessourceUser($queryBuilder, $resourceClass);
   }
}