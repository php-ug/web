<?php

declare(strict_types=1);

use Phpug\Web\Integration\Actions\AboutAction;
use Phpug\Web\Integration\Actions\ContactAction;
use Phpug\Web\Integration\Actions\ImprintAction;
use Phpug\Web\Integration\Actions\LegalAction;
use Phpug\Web\Integration\Actions\MailproxyAction;
use Phpug\Web\Integration\Actions\MainAction;
use Phpug\Web\Integration\Actions\PrivacyAction;
use Phpug\Web\Integration\Actions\TeamAction;
use Phpug\Web\Integration\Middleware\AddRouteToRequestMiddleware;
use Phpug\Web\Integration\Middleware\DtoResponseConverter;
use Slim\Factory\AppFactory;
use Slim\Views\Twig;
use Slim\Views\TwigMiddleware;

require __DIR__ . '/../vendor/autoload.php';

$container = require_once  __DIR__ . '/../config/container.php';
$app = AppFactory::create();
/**
 * The routing middleware should be added earlier than the ErrorMiddleware
 * Otherwise exceptions thrown from it will not be handled by the middleware
 */
$app->add(TwigMiddleware::create($app, $container->get(Twig::class)));
$app->addMiddleware($container->get(DtoResponseConverter::class));
$app->addMiddleware($container->get(AddRouteToRequestMiddleware::class));
$app->addRoutingMiddleware();
$app->addErrorMiddleware(filter_var(getenv('DEBUG'), FILTER_VALIDATE_BOOLEAN), true, true);

$app->get('/', $container->get(MainAction::class))
	->setName('main');
$app->get('/ug/team', $container->get(TeamAction::class))
	->setName('team');
$app->get('/mailproxy/{liame}', $container->get(MailproxyAction::class))
	->setName('mailproxy');
$app->get('/ug/imprint', $container->get(ImprintAction::class))
	->setName('imprint');
$app->get('/ug/legal', $container->get(LegalAction::class))
	->setName('legal');
$app->get('/ug/privacy', $container->get(PrivacyAction::class))
	->setName('privacy');
$app->get('/ug/about', $container->get(AboutAction::class))
	->setName('about');
$app->get('/ug/promote', function (){})
	->setName('promote');
$app->get('/ug/tips', function (){})
	->setName('tips');
$app->map(['GET', 'POST'], '/ug/contact', $container->get(ContactAction::class))
	->setName('contact');

$app->run();
