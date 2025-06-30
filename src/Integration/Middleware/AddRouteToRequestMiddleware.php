<?php declare(strict_types=1);

namespace Phpug\Web\Integration\Middleware;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Slim\Routing\RouteContext;

final class AddRouteToRequestMiddleware implements MiddlewareInterface
{
	public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
	{
		$routeContext = RouteContext::fromRequest($request);
		$request = $request->withAttribute('route', $routeContext->getRoute());

		return $handler->handle($request);
	}
}
