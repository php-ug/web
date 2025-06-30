<?php declare(strict_types=1);

namespace Phpug\Web\Application;

use Psr\Http\Message\MessageInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\StreamInterface;

final class DtoResponse implements ResponseInterface
{
	public function __construct(
		private readonly object $dto,
		private readonly ResponseInterface $response
	) {}

	public function getProtocolVersion(): string
	{
		return $this->response->getProtocolVersion();
	}

	public function withProtocolVersion($version): MessageInterface
	{
		return new self($this->dto, $this->response->withProtocolVersion($version));
	}

	public function getHeaders(): array
	{
		return $this->response->getHeaders();
	}

	public function hasHeader($name): bool
	{
		return $this->response->hasHeader($name);
	}

	public function getHeader($name): array
	{
		return $this->response->getHeader($name);
	}

	public function getHeaderLine($name): string
	{
		return $this->response->getHeaderLine($name);
	}

	public function withHeader($name, $value): MessageInterface
	{
		return new self($this->dto, $this->response->withHeader($name, $value));
	}

	public function withAddedHeader($name, $value): MessageInterface
	{
		return new self($this->dto, $this->response->withAddedHeader($name, $value));
	}

	public function withoutHeader($name): MessageInterface
	{
		return new self($this->dto, $this->response->withoutHeader($name));
	}

	public function getBody(): StreamInterface
	{
		return $this->response->getBody();
	}

	public function withBody(StreamInterface $body): MessageInterface
	{
		return new self($this->dto, $this->response->withBody($body));
	}

	public function getStatusCode(): int
	{
		return $this->response->getStatusCode();
	}

	public function withStatus($code, $reasonPhrase = ''): ResponseInterface
	{
		return new self($this->dto, $this->response->withStatus($code, $reasonPhrase));
	}

	public function getReasonPhrase(): string
	{
		return $this->response->getReasonPhrase();
	}

	public function getDto(): object
	{
		return $this->dto;
	}
}
