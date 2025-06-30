<?php

namespace Phpug\Web\Integration\Renderer;

use Psr\Http\Message\ResponseInterface;
use Slim\Routing\Route;

interface Renderer
{
	public function renders(): MimeTypeList;
	public function renderDto(object $dto, Route $route, ResponseInterface $response): ResponseInterface;
}
