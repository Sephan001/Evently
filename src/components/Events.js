import React from "react";

const Events = (props) => {
	return (
		<div className="container">
			<div class="row justify-content-center">
				{props.events.map((evento) => (
					<div className="col-md-4">
						<div
							class="card shadow"
							style={{ width: "20rem" }}
							key={evento.index}
						>
							<div className="inner">
								{" "}
								<img
									class="card-img-top"
									src={evento.image}
									alt="img"
								/>
							</div>
							<div class="card-body text-center">
								<h1 className="title">{evento.image}</h1>
								<h5 class="card-body">{evento.theme}</h5>
								<h5 class="card-body">
									<i class="fa-solid fa-calendar-days"></i>
									{evento.date}
								</h5>
								<h5 class="card-body">
									<i class="fa-solid fa-location-dot"></i>{" "}
									{evento.location}
								</h5>

								<p class="card-text">
									{evento.price / 1000000000000000000}cUSD
								</p>
								<a
									href="/#"
									class="btn btn-success"
									onClick={() =>
										props.buyTicket(evento.index)
									}
								>
									Buy Event Ticket
								</a>
								<div>
									{evento.hasFollowed ? (
										<>
											<a
												href="/#"
												class="btn btn-danger"
												onClick={() =>
													props.unFollowEvent(
														evento.index
													)
												}
											>
												<i class="fa-solid fa-hand-back-point-right"></i>
												unFollow Event
											</a>
											<a
												href="/#"
												class="btn btn-danger"
												onClick={() =>
													props.unFollowEvent(
														evento.index
													)
												}
											>
												<small class="jt">
													{evento.follow} Followed
												</small>
											</a>
										</>
									) : (
										<>
											<a
												href="/#"
												class="btn btn-secondary"
												onClick={() =>
													props.followEvent(
														evento.index
													)
												}
											>
												<i class="fa-solid fa-hand-back-point-right"></i>
												Follow Event
											</a>
											<a
												href="/#"
												class="btn btn-secondary"
												onClick={() =>
													props.followEvent(
														evento.index
													)
												}
											>
												<small class="jt">
													{evento.follow} Followed
												</small>
											</a>
										</>
									)}
								</div>
							</div>
						</div>
					</div>
				))}
				;
			</div>
		</div>
	);
};
export default Events;
