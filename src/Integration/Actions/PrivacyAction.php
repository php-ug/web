<?php declare(strict_types=1);

namespace Phpug\Web\Integration\Actions;

use Phpug\Web\Application\DtoResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class PrivacyAction
{
	public function __invoke(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
	{
		return new DtoResponse(new class(){
			public string $user = 'Andreas Heigl';
			public string $address = 'Forsthausstraße 7, 61279 Grävenwiesbach';
			public string $email = 'andreas@php.ug';
		}, $response);
	}
}
