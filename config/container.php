<?php

use League\Container\Container;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
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
use Phpug\Web\Integration\Renderer\TextHtmlRenderer;
use Phpug\Web\Integration\Twig\Gravatar;
use Slim\App;
use Slim\Factory\AppFactory;
use Slim\Views\Twig;
use Slim\Views\TwigRuntimeExtension;
use Twig\Environment;

$container = new Container();

$container->add(Environment::class, function() use ($container) {
	$env = $container->get(Twig::class)->getEnvironment();
	$env->addExtension(new Gravatar());
	return $env;
});

$container->addShared(Twig::class, function() {
	return Twig::create(__DIR__ . '/../templates', [
		'debug' => filter_var(getenv('TWIG_DEBUG'),  FILTER_VALIDATE_BOOLEAN),
		'cache' => false, //__DIR__ . '/../var/cache/twig',
	]);
});

$container->add(PHPMailer::class, function() use ($container) {
	$mail = new PHPMailer(true);
	$mail->isSMTP();
	$mail->Host = getenv('MAILER_SMPT_HOST');
	if (getenv('MAILER_SMTP_USERNAME') &&  getenv('MAILER_SMTP_PASSWORD')) {
		$mail->SMTPAuth = true;                                   //Enable SMTP authentication
		$mail->Username = getenv('MAILER_SMTP_USERNAME');                     //SMTP username
		$mail->Password = getenv('MAILER_SMTP_PASSWORD');                               //SMTP password
	}
	if (filter_var(getenv('MAILER_SMTP_TLS'), FILTER_VALIDATE_BOOLEAN)) {
		$mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            //Enable implicit TLS encryption
	}
	$mail->Port = (int) getenv('MAILER_SMTP_PORT');

	$mail->setFrom(getenv('MAILER_SENDER_EMAIL'), getenv('MAILER_SENDER_NAME'));

	return $mail;
});

$container->add(TextHtmlRenderer::class)
	->addArgument(Environment::class)
	->addArgument(App::class)
;

$container->add(DtoResponseConverter::class)
	->addArgument($container->get(TextHtmlRenderer::class))
;

$container->add(App::class, function () use ($container) {
	return AppFactory::create();
});

$container->add(AddRouteToRequestMiddleware::class);

$container->add(MainAction::class);
$container->add(TeamAction::class);
$container->add(MailproxyAction::class);
$container->add(ImprintAction::class);
$container->add(LegalAction::class);
$container->add(PrivacyAction::class);
$container->add(AboutAction::class);
$container->add(ContactAction::class)
	->addArgument(PHPMailer::class);

$container->add(TwigRuntimeExtension::class);


return $container;
