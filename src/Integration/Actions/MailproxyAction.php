<?php declare(strict_types=1);

namespace Phpug\Web\Integration\Actions;

use Phpug\Web\Application\DtoResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class MailproxyAction
{
	public function __invoke(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
	{
		return $response->withHeader('Location', 'mailto:' . strrev($args['liame']));
	}
}
