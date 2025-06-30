<?php declare(strict_types=1);

namespace Phpug\Web\Integration\Actions;

use PHPMailer\PHPMailer\PHPMailer;
use Phpug\Web\Application\DtoResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class ContactAction
{
	public function __construct(
		private PHPMailer $mailer,
	){}

	public function __invoke(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
	{
		if ($request->getMethod() === 'POST') {
			// validate
			$values = $request->getParsedBody();
			if ($values['country'] !== '') {
				return $response->withStatus(451);
			}

			$mail = $this->mailer;
			try {
				//Recipients
				$mail->addAddress('andreas@php.ug', 'Andreas Heigl');     //Add a recipient
				$mail->addReplyTo($values['from']);
				$mail->addCC($values['from']);

				//Content
				$mail->isHTML(false);                                  //Set email format to HTML
				$mail->Subject = $values['subject'];
				$mail->Body = $values['body'];

				$mail->send();
				return $response->withStatus(302)
					->withHeader('Location', '/ug/contact');
			} catch(\Exception $e) {
				return new DtoResponse(new class(
					$values['from'],
					$values['subject'],
					$values['body'],
					$e->getMessage(),
				) {
					public function __construct(
						public string $from,
						public string $subject,
						public string $body,
						public null|string $error = null,
					) {}
				}, $response);
			}
		}

		return new DtoResponse(new class() {}, $response);
	}
}
